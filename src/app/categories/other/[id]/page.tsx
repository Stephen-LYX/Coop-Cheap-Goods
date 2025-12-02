/*
Title: Product listing page
Author: Miles Paleveda
Date: 11/13/2025

Credits: This file includes the following third party and open source softwares:
  -Next.js: license in /credits/nextjs/LICENSE
  -React: license in /credits/react/LICENSE
  -Supabase: license in /credits/supabase/LICENSE
  -Tailwind CSS: license in /credits/tailwindcss/LICENSE
  -Flowbite: license in /credits/flowbite/LICENSE
  -Flowbite Icons: license in /credits/flowbite-icons/LICENSE
  -Flowbite docs code: attribution in /credits/flowbite docs code/attribution.txt
*/

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";
import { BreadCrumbs } from "@/component/BreadCrumbs";
import { ReportButton } from "@/component/ReportButton";

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
    //const user = { id: "00000000-0000-0000-0000-000000000001" };

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
    let reported;
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

    //get seller reviews
    const { data: sellerReviews, error: sellerReviewsError } = await supabase
      .from("seller_reviews")
      .select()
      .eq("seller", "00000000-0000-0000-0000-000000000002")
      .order("created_at", { ascending: false });

    //get the average rating of all reviews of the seller
    const {
      data: { avg: sellerRating },
      error: sellerRatingError,
    } = await supabase
      .from("seller_reviews")
      .select("rating.avg()")
      .eq("seller", "00000000-0000-0000-0000-000000000002")
      .single();

    console.log(sellerRating);

    //build array for rating stars
    function buildRatingArray(rating) {
      const arr = Array(5);
      for (let i = 0; i < arr.length; i++) {
        let value;
        if (rating >= 1) {
          value = 1;
        } else {
          value = 0;
        }
        arr[i] = { value: value };
        rating--;
      }
      return arr;
    }

    const sellerReviewRatingArray = buildRatingArray(sellerRating);

    return (
      <main>
        <Navbar />
        <div className="p-4 mx-auto max-w-5xl">
          <BreadCrumbs />
          <div className="flex flex-col md:flex-row">
            <div className="flex-3 md:mr-4">
              <div className="aspect-square overflow-hidden mb-4">
                <Image
                  src={`/uploaded/${item.image_url}`}
                  alt={item.title}
                  width={800}
                  height={800}
                  objectFit="cover"
                  className="bg-gray-300"
                ></Image>
              </div>

              <div className="grid grid-cols-5 gap-4 mb-4">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={`/uploaded/${item.image_url}`}
                    alt={item.title}
                    width={180}
                    height={180}
                    className="bg-gray-300"
                  ></Image>
                </div>
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={`/uploaded/${item.image_url}`}
                    alt={item.title}
                    width={180}
                    height={180}
                    className="bg-gray-300"
                  ></Image>
                </div>
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={`/uploaded/${item.image_url}`}
                    alt={item.title}
                    width={180}
                    height={180}
                    className="bg-gray-300"
                  ></Image>
                </div>
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={`/uploaded/${item.image_url}`}
                    alt={item.title}
                    width={180}
                    height={180}
                    className="bg-gray-300"
                  ></Image>
                </div>
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={`/uploaded/${item.image_url}`}
                    alt={item.title}
                    width={180}
                    height={180}
                    className="bg-gray-300"
                  ></Image>
                </div>
              </div>
            </div>
            <div className="flex-2">
              <h1 className="font-bold text-heading text-2xl">
                {item.title} - $
                {item.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </h1>
              <p className="text-lg">
                Category: <Link href={"/categories/other"}>Other</Link>
              </p>
              <Link
                href="/inbox"
                className="block text-center text-white bg-blue-600 box-border border border-transparent hover:bg-blue-700 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
              >
                Message Seller
              </Link>
              <ReportButton
                reported={reported}
                userID={user?.id}
                itemID={itemID}
              />
              <hr className="my-4"></hr>
              <p>{item.description}</p>
              <hr className="my-4"></hr>
              <div className="flex">
                <Image
                  src={seller.avatar_url}
                  alt=""
                  width={50}
                  height={50}
                  className="bg-gray-300 rounded-full"
                ></Image>
                <div className="ml-2">
                  <p className="font-bold">{seller.username}</p>

                  <a href="">
                    <div className="flex">
                      <div className="flex">
                        {sellerReviewRatingArray.map((star, index) => {
                          return (
                            <svg
                              key={index}
                              className={
                                star.value
                                  ? "w-6 h-6 text-yellow-300"
                                  : "w-6 h-6 text-gray-300 dark:text-gray-500"
                              }
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                            </svg>
                          );
                        })}
                      </div>
                      <p className="text-sm/6 ml-1">
                        {sellerReviews?.length} reviews
                      </p>
                    </div>
                  </a>
                </div>
              </div>
              <hr className="my-4"></hr>
              <h2 className="text-xl font-bold">Recent Seller Reviews</h2>
              <ul>
                {sellerReviews.map((review) => {
                  //get reviewer username
                  async function getReviewerUserName() {
                    const { data: reviewer } = await supabase
                      .from("profiles")
                      .select("username")
                      .eq("id", review.reviewer)
                      .single();
                    const { username } = reviewer;
                    return username;
                  }
                  const reviewerUserName = getReviewerUserName();

                  //get date review created at
                  const reviewDate = new Date(Date.parse(review.created_at));

                  const reviewRatingArray = buildRatingArray(review.rating);

                  return (
                    <li key={review.id} className="my-4">
                      <h3 className="text-lg font-bold">{review.title}</h3>
                      <p className="line-clamp-3">{review.description}</p>
                      <div className="flex">
                        {reviewRatingArray.map((star) => {
                          return (
                            <svg
                              key={star.id}
                              className={
                                star.value
                                  ? "w-6 h-6 text-yellow-300"
                                  : "w-6 h-6 text-gray-300 dark:text-gray-500"
                              }
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                            </svg>
                          );
                        })}
                        <p className="text-sm/6 ml-1">
                          By&nbsp;
                          <a href="" className="underline">
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
