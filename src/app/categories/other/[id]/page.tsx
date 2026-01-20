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
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";
import { BreadCrumbs } from "@/component/item-listing-page/BreadCrumbs";
import { ItemPicturesDisplay } from "@/component/item-listing-page/ItemPicturesDisplay";
import { ReportButton } from "@/component/ReportButton";
import { ReviewRatingStars } from "@/component/item-listing-page/ReviewRatingStars";

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
    /*
    const {
      data: { user },
    } = await supabase.auth.getUser();
     */
    const user = { id: "00000000-0000-0000-0000-000000000001" };

    //get item from database
    const { data: item } = await supabase
      .from("other_items") // select from other_items table
      .select() // select all columns
      .eq("id", itemID) // where the item id = itemID
      .single() // return data as a single object
      .throwOnError();

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
      await supabase
        .from("seller_reviews")
        .select()
        .eq("seller", "00000000-0000-0000-0000-000000000002");

    //get recent seller reviews
    const { data: recentSellerReviews, error: recentSellerReviewsError } =
      await supabase
        .from("seller_reviews")
        .select()
        .eq("seller", "00000000-0000-0000-0000-000000000002")
        .order("created_at", { ascending: false })
        .limit(3);

    //get the average rating of all reviews of the seller
    const {
      data,
      error: sellerRatingError,
    } = await supabase
      .from("seller_reviews")
      .select("rating.avg()")
      .eq("seller", "00000000-0000-0000-0000-000000000002")
      .single();

    const sellerRating = data?.avg ?? 0;

    return (
      <main>
        <Navbar />
        <div className="p-4 mx-auto max-w-5xl">
          <BreadCrumbs title={item.title} />
          <div className="flex flex-col md:flex-row">
            <div className="flex-3 md:mr-4">
              <ItemPicturesDisplay item={item} />
            </div>
            <div className="flex-2">
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
                  href={"/categories/other"}
                >
                  Other
                </Link>
              </p>
              <Link
                href="/inbox"
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
              <h2 className="font-bold text-heading text-xl">Seller</h2>
              <div className="flex">
                <Image
                  src={seller.avatar_url}
                  alt=""
                  width={50}
                  height={50}
                  className="bg-gray-300 rounded-full"
                ></Image>
                <div className="ml-2">
                  <Link href="" className="hover:text-blue-700">
                    {seller.username}
                  </Link>

                  <Link href="" className="flex hover:text-blue-700">
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
                          <a href="" className="hover:text-blue-700">
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
