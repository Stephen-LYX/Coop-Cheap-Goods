"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

import ProfileBanner from "@/components/profile/ProfileBanner";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProfileTabs, { type ProfileTab } from "@/components/profile/ProfileTabs";
import ProfileShopTab from "@/components/profile/ProfileShopTab";
import ProfileReviewsTab from "@/components/profile/ProfileReviewsTab";
import ProfileAboutTab from "@/components/profile/ProfileAboutTab";
import ImageUploadModal from "@/components/profile/ImageUploadModal";
import type { Item } from "@/components/ItemCard";

/*
 * DATABASE MIGRATION — Run this SQL in your Supabase Dashboard (SQL Editor)
 * before using this page if the columns don't already exist:
 *
 *   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
 *   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location text;
 *   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}';
 */

interface ProfileData {
  username: string;
  email: string;
  joinDate: string;
  bio: string | null;
  location: string | null;
  socialLinks: Record<string, string>;
  avatarUrl: string | null;
  bannerUrl: string | null;
}

interface EditData {
  username: string;
  bio: string;
  location: string;
  socialLinks: Record<string, string>;
}

interface DbItem {
  id: number;
  title: string;
  description: string | null;
  price: number;
  condition: string;
  category: string;
  image_path: string | null;
  image_url: string | null;
  user_id?: string;
  created_at?: string;
}

export default function ProfilePage() {
  const { user, supabase } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData>({
    username: "",
    email: "",
    joinDate: "",
    bio: null,
    location: null,
    socialLinks: {},
    avatarUrl: null,
    bannerUrl: null,
  });

  const [userItems, setUserItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>("shop");

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    username: "",
    bio: "",
    location: "",
    socialLinks: {},
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Image upload state
  const [uploadModal, setUploadModal] = useState<"avatar" | "banner" | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // Initialize profile data from auth user
  useEffect(() => {
    if (user) {
      const joinDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "Recently";

      setProfileData((prev) => ({
        ...prev,
        username: user.user_metadata?.username || user.email?.split("@")[0] || "User",
        email: user.email || "",
        joinDate,
      }));

      fetchProfile();
      fetchUserItems();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, banner_url, bio, location, social_links")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfileData((prev) => ({
          ...prev,
          username: data.username || prev.username,
          avatarUrl: data.avatar_url || null,
          bannerUrl: data.banner_url || null,
          bio: data.bio || null,
          location: data.location || null,
          socialLinks: data.social_links || {},
        }));
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }
  };

  const fetchUserItems = async () => {
    if (!user) return;
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching user items:", error);
        setUserItems([]);
      } else if (data) {
        setUserItems(
          data.map((item: DbItem) => ({
            id: item.id,
            name: item.title,
            image: item.image_url || "",
            condition: item.condition,
            price: item.price,
            user_id: item.user_id,
            category: item.category,
          }))
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setUserItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  // --- Editing ---

  const handleEditClick = () => {
    setEditData({
      username: profileData.username,
      bio: profileData.bio || "",
      location: profileData.location || "",
      socialLinks: { ...profileData.socialLinks },
    });
    setSaveError(null);
    setIsEditing(true);
  };

  const handleEditChange = (
    field: keyof EditData,
    value: string | Record<string, string>
  ) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    // Clean up previews
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setPendingAvatarFile(null);
    setPendingBannerFile(null);
    setAvatarPreview(null);
    setBannerPreview(null);
    setSaveError(null);
    setIsEditing(false);
  };

  const uploadImage = async (
    file: File,
    type: "profile" | "banner"
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Upload failed");
    return `/uploaded/${data.filename}`;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const updates: Record<string, unknown> = {};

      // Upload pending images
      if (pendingAvatarFile) {
        const url = await uploadImage(pendingAvatarFile, "profile");
        updates.avatar_url = url;
      }
      if (pendingBannerFile) {
        const url = await uploadImage(pendingBannerFile, "banner");
        updates.banner_url = url;
      }

      // Always include NOT NULL columns for upsert
      updates.username = editData.username;
      updates.email = user!.email;
      updates.bio = editData.bio || null;
      updates.location = editData.location || null;
      updates.social_links = editData.socialLinks;

      {
        const { error } = await supabase
          .from("profiles")
          .upsert({ id: user!.id, ...updates }, { onConflict: "id" });

        if (error) {
          console.error("Profile save error:", error);
          console.error("User ID:", user!.id);
          console.error("Updates:", updates);
          setSaveError("Failed to save profile: " + error.message);
          setIsSaving(false);
          return;
        }
      }

      // Apply changes to local state
      setProfileData((prev) => ({
        ...prev,
        username: editData.username,
        bio: editData.bio || null,
        location: editData.location || null,
        socialLinks: editData.socialLinks,
        avatarUrl: (updates.avatar_url as string) || prev.avatarUrl,
        bannerUrl: (updates.banner_url as string) || prev.bannerUrl,
      }));

      // Clean up
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      setPendingAvatarFile(null);
      setPendingBannerFile(null);
      setAvatarPreview(null);
      setBannerPreview(null);
      setIsEditing(false);

      toast.success("Profile updated!");
    } catch (err) {
      console.error("Save error:", err);
      setSaveError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Image upload modal ---

  const handleImageConfirm = (file: File) => {
    if (uploadModal === "avatar") {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setPendingAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else if (uploadModal === "banner") {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      setPendingBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
    setUploadModal(null);
  };

  // Displayed URLs: preview takes priority over saved URL
  const displayAvatarUrl = avatarPreview || profileData.avatarUrl;
  const displayBannerUrl = bannerPreview || profileData.bannerUrl;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner — full width */}
      <ProfileBanner
        bannerUrl={displayBannerUrl}
        isEditing={isEditing}
        onUploadClick={() => setUploadModal("banner")}
      />

      <div className="max-w-6xl mx-auto">
        {/* Profile info / edit section */}
        <div className="bg-white px-6 pt-0 pb-6 shadow-sm">
          {/* Avatar pulled up over banner edge */}
          <div className="flex justify-start pl-2">
            <ProfileAvatar
              avatarUrl={displayAvatarUrl}
              username={profileData.username}
              isEditing={isEditing}
              onUploadClick={() => setUploadModal("avatar")}
            />
          </div>

          <div className="mt-4">
          {isEditing ? (
            <ProfileEditForm
              data={editData}
              onChange={handleEditChange}
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={isSaving}
              error={saveError}
            />
          ) : (
            <ProfileInfo
              username={profileData.username}
              email={profileData.email}
              joinDate={profileData.joinDate}
              bio={profileData.bio}
              location={profileData.location}
              socialLinks={profileData.socialLinks}
              onEditClick={handleEditClick}
              itemCount={userItems.length}
            />
          )}

          {/* Tabs */}
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            itemCount={userItems.length}
            reviewCount={0}
          />
          </div>
        </div>

        {/* Tab content */}
        <div className="bg-white mt-1 p-6 shadow-sm mb-8">
          {activeTab === "shop" && (
            <ProfileShopTab items={userItems} loading={loadingItems} />
          )}
          {activeTab === "reviews" && <ProfileReviewsTab />}
          {activeTab === "about" && (
            <ProfileAboutTab
              bio={profileData.bio}
              location={profileData.location}
              joinDate={profileData.joinDate}
              socialLinks={profileData.socialLinks}
              itemCount={userItems.length}
            />
          )}
        </div>
      </div>

      {/* Image upload modal */}
      <ImageUploadModal
        isOpen={uploadModal !== null}
        onClose={() => setUploadModal(null)}
        onConfirm={handleImageConfirm}
        type={uploadModal || "avatar"}
        currentImageUrl={
          uploadModal === "banner" ? displayBannerUrl : displayAvatarUrl
        }
      />
    </main>
  );
}
