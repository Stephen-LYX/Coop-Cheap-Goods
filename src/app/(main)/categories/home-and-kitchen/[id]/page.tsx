/*
Title: Product listing page for "Other" category
Author: Miles Paleveda
Date: 1/16/2026

Credits: This file includes the following third party and open source softwares:
  -Next.js: license in /credits/nextjs/LICENSE
  -React: license in /credits/react/LICENSE
  -Supabase: license in /credits/supabase/LICENSE
  -Tailwind CSS: license in /credits/tailwindcss/LICENSE
  -Flowbite: license in /credits/flowbite/LICENSE
  -Flowbite Icons: license in /credits/flowbite-icons/LICENSE
  -Flowbite docs code: attribution in /credits/flowbite-docs-code/attribution.txt
*/

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import { BreadCrumbs } from "@/components/item-listing-page/BreadCrumbs";
import { ReportButton } from "@/components/item-listing-page/ReportButton";
import { ReviewRatingStars } from "@/components/item-listing-page/ReviewRatingStars";

export default async function Item({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  //item id from url
  const { id: itemID } = await params;

  try {
    const supabase = await createClient();

    //get user

    const {
      data: { user },
    } = await supabase.auth.getUser();

    //test user
    //const user = { id: "00000000-0000-0000-0000-000000000001" };

    //get item from database — check generic items table first (new listings), then category table (old listings)
    let { data: item } = await supabase.from("items").select().eq("id", itemID).maybeSingle();
    if (!item) {
      const { data: categoryItem } = await supabase
        .from("items_home_and_kitchen")
        .select()
        .eq("id", itemID)
        .single()
        .throwOnError();
      item = categoryItem;
    }

    //get item seller username and avatar_url
    const { data: seller } = await supabase
      .from("profiles")
      .select("username, avatar_url") // select the username column
      .eq("id", item.user_id) // where the profile id = this item's seller's user id
      .single()
      .throwOnError();

    //If user, check if user already reported this item
    let reported = false;
    if (user) {
      const { data: reports } = await supabase
        .from("reports")
        .select()
        .eq("item", itemID)
        .eq("profile", user?.id)
        .throwOnError();
      if (reports.length > 0) {
        reported = true;
      }
    }

    //get seller review count
    const { data: sellerReviewCount, error: sellerReviewCountError } =
      await supabase.from("seller_reviews").select().eq("seller", item.user_id);

    //get recent seller reviews
    const { data: recentSellerReviews, error: recentSellerReviewsError } =
      await supabase
        .from("seller_reviews")
        .select()
        .eq("seller", item.user_id)
        .order("created_at", { ascending: false })
        .limit(3);

    //get the average rating of all reviews of the seller
    const { data, error: sellerRatingError } = await supabase
      .from("seller_reviews")
      .select("rating.avg()")
      .eq("seller", item.user_id)
      .single();

    const sellerRating = data?.avg ?? 0;

    return (
      <main>
        <div className="p-4 mx-auto max-w-7xl">
          <BreadCrumbs title={item.title} />
          <div className="flex flex-col md:flex-row">
            <div className="flex-auto max-w-full md:w-100 md:mr-4">
              <div className={"aspect-square overflow-hidden"}>
                <Image
                  src={item.image_url?.startsWith('http') ? item.image_url : `/uploaded/${item.image_url}`}
                  alt={item.title}
                  width={800}
                  height={800}
                  objectFit="cover"
                  className="bg-gray-300"
                ></Image>
              </div>
            </div>
            <div className="flex-auto max-w-full md:w-60">
              <h1 className="font-bold text-heading text-2xl">
                {item.title} - $
                {item.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </h1>
              <p className="text-lg">
                Category:{" "}
                <Link
                  className="hover:text-blue-700"
                  href={`/categories/home-and-kitchen`}
                >
                  Home and Kitchen
                </Link>
              </p>
              <Link
                href={`/inbox?sellerId=${item.user_id}&itemId=${itemID}`}
                className="block text-center text-white bg-blue-600 box-border border border-transparent hover:bg-blue-700 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded px-4 py-2.5 my-4 focus:outline-none"
              >
                Message Seller
              </Link>
              <ReportButton
                reported={reported}
                userID={user?.id}
                itemID={itemID}
              />
              <hr className="my-4"></hr>
              <h2 className="font-bold text-heading text-xl">Description</h2>
              <p>{item.description}</p>
              <hr className="my-4"></hr>
              <h2 className="font-bold text-heading text-xl">About</h2>
              <ul className="list-disc list-inside">
                <li>Condition: {item.condition ? item.condition : "NA"}</li>
              </ul>
              <hr className="my-4"></hr>
              <h2 className="font-bold text-heading text-xl">Seller</h2>
              <div className="flex">
                <Image
                  src={seller.avatar_url || "/default-avatar.png"}
                  alt=""
                  width={50}
                  height={50}
                  className="bg-gray-300 rounded-full"
                ></Image>
                <div className="ml-2">
                  <Link href="/profile" className="hover:text-blue-700">
                    {seller.username}
                  </Link>

                  <Link href="/profile" className="flex hover:text-blue-700">
                    <ReviewRatingStars rating={sellerRating} />
                    <p className="text-sm/6 ml-1">
                      {sellerReviewCount?.length} reviews
                    </p>
                  </Link>
                </div>
              </div>
              <hr className="my-4"></hr>
              <h2 className="text-xl font-bold">Recent Seller Reviews</h2>
              <ul>
                {recentSellerReviews?.map((review) => {
                  //get reviewer username
                  async function getReviewerUserName() {
                    const { data: reviewer } = await supabase
                      .from("profiles")
                      .select("username")
                      .eq("id", review.reviewer)
                      .single();
                    const username = reviewer?.username;
                    return username;
                  }
                  const reviewerUserName = getReviewerUserName();

                  //get date review created at
                  const reviewDate = new Date(Date.parse(review.created_at));

                  return (
                    <li key={review.id} className="my-4">
                      <h3 className="text-lg font-bold">{review.title}</h3>
                      <p className="line-clamp-3">{review.description}</p>
                      <div className="flex">
                        <ReviewRatingStars rating={review.rating} />
                        <p className="text-sm/6 ml-1 ">
                          By&nbsp;
                          <a href="/profile" className="hover:text-blue-700">
                            {reviewerUserName}
                          </a>
                          &nbsp;on {reviewDate.toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.log(error);
    return (
      <main>
        <Navbar />
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="m-8">
            <h1 className="font-bold text-500 text-2xl">
              Error: Could not retrieve item.
            </h1>
          </div>
        </div>
      </main>
    );
  }
}
