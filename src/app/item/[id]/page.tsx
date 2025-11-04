/*
Title: Product listing page
Author: Miles Paleveda
Date: 10/28/2025

Credits: This file includes the following third party and open source softwares:
  -Next.js: license in /credits/nextjs/LICENSE
  -React: license in /credits/react/LICENSE
  -Supabase: license in /credits/supabase/LICENSE
  -Tailwind CSS: license in /credits/tailwindcss/LICENSE
  -Flowbite Icons: license in /credits/flowbite-icons/LICENSE
*/

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";
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
    const { data: item, error: itemError } = await supabase
      .from("items") // select from items table
      .select() // select all columns
      .eq("id", itemID) // where the item id = itemID
      .single() // return data as a single object
      .throwOnError();

    //get item seller username and avatar_url
    const { data: seller, error: sellerError } = await supabase
      .from("profiles")
      .select("username, avatar_url") // select the username column
      .eq("id", item.user_id) // where the profile id = this item's seller's user id
      .single()
      .throwOnError();

    //If user, check if user already reported this item
    let reported;
    if (user) {
      const { data: reports, error: reportsError } = await supabase
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
    const { data: seller_reviews } = await supabase
      .from("seller_reviews")
      .select()
      .eq("seller", "00000000-0000-0000-0000-000000000002")
      .order("created_at", { ascending: false });

    const { data: seller_rating } = await supabase
      .from("seller_reviews")
      .select("rating.avg()");
    console.log(seller_rating);

    return (
      <main>
        <Navbar />
        <div className="flex min-h-screen">
          <Sidebar />
          <div className=" flex p-8">
            <div className="flex-none pr-4">
              <Image
                src={item.image_url}
                alt={item.title}
                width={125}
                height={125}
                className="bg-gray-300 mb-4"
              ></Image>
              <Image
                src={item.image_url}
                alt={item.title}
                width={125}
                height={125}
                className="bg-gray-300 mb-4"
              ></Image>
              <Image
                src={item.image_url}
                alt={item.title}
                width={125}
                height={125}
                className="bg-gray-300 mb-4"
              ></Image>
              <Image
                src={item.image_url}
                alt={item.title}
                width={125}
                height={125}
                className="bg-gray-300 mb-4"
              ></Image>
              <Image
                src={item.image_url}
                alt={item.title}
                width={125}
                height={125}
                className="bg-gray-300 mb-4"
              ></Image>
            </div>
            <div className="flex-auto">
              <Image
                src={item.image_url}
                alt={item.title}
                width={600}
                height={600}
                className="bg-gray-300"
              ></Image>
            </div>
            <div className="flex-auto pl-4 w-100">
              <h1 className="font-bold text-500 text-2xl">
                {item.title} - $
                {item.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </h1>
              <p className="text-xl">Category: {item.category}</p>
              <Link
                href="/inbox"
                className="block py-2 my-4 border border-neutral-950 text-center w-auto hover:bg-gray-100 rounded"
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
                  <a href="" className="text-sm">
                    98% positive reviews
                  </a>
                </div>
              </div>
              <hr className="my-4"></hr>
              <h2 className="text-xl font-bold">Recent Seller Reviews</h2>
              <ul>
                {seller_reviews.map((review) => {
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

                  //build array for rating stars
                  const reviewStars = [];
                  for (let i = 1; i <= 5; i++) {
                    let value;
                    if (review.rating >= 1) {
                      value = 1;
                    } else {
                      value = 0;
                    }
                    reviewStars.push({ id: i, value: value });
                    review.rating--;
                  }

                  return (
                    <li key={review.id} className="my-4">
                      <h3 className="text-lg font-bold">{review.title}</h3>
                      <p className="line-clamp-3">{review.description}</p>
                      <div className="flex">
                        {reviewStars.map((star) => {
                          if (star.value == 1) {
                            return (
                              <svg
                                key={star.id}
                                className="w-6 h-6 text-gray-800 dark:text-white"
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
                          } else if (star.value == 0.5) {
                            return (
                              <svg
                                key={star.id}
                                className="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M13 4.024v-.005c0-.053.002-.353-.217-.632a1.013 1.013 0 0 0-1.176-.315c-.192.076-.315.193-.35.225-.052.05-.094.1-.122.134a4.358 4.358 0 0 0-.31.457c-.207.343-.484.84-.773 1.375a168.719 168.719 0 0 0-1.606 3.074h-.002l-4.599.367c-1.775.14-2.495 2.339-1.143 3.488L6.17 15.14l-1.06 4.406c-.412 1.72 1.472 3.078 2.992 2.157l3.94-2.388c.592-.359.958-.996.958-1.692v-13.6Zm-2.002 0v.025-.025Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            );
                          } else {
                            return (
                              <svg
                                key={star.id}
                                className="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-width="2"
                                  d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
                                />
                              </svg>
                            );
                          }
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
