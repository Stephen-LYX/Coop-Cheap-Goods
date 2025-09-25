//license for heroicons in src/app//item/[id] directory
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";

export default async function Item() {
  try {
    const supabase = await createClient();
    //get item from database
    const { data: item } = await supabase
      .from("items") // select from items table
      .select() // select all columns
      .eq("id", 1) // where the item id = 1
      .single(); // return data as a single object
    //get item seller username
    const { data: seller } = await supabase
      .from("profiles")
      .select("username") // select the username column
      .eq("id", item.user_id) // where the profile id = the item id
      .single();
    return (
      <main>
        <Navbar />
        <div className="flex min-h-screen">
          <Sidebar />
          <div className=" flex p-8">
            <div className="flex-none pr-4">
              <Image
                src={item.image_url} //use item data
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
            <div className="flex-1">
              <Image
                src={item.image_url}
                alt={item.title}
                width={600}
                height={600}
                className="bg-gray-300"
              ></Image>
            </div>
            <div className="flex-auto pl-4">
              <h1 className="font-bold text-500 text-2xl">
                {item.title} - $
                {item.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </h1>
              <p className="text-xl">Category: {item.category}</p>
              <a
                href="http://localhost:3000/inbox"
                className="block py-2 my-4 border border-neutral-950 text-center w-auto hover:bg-gray-100 rounded"
              >
                Message Seller
              </a>
              <hr className="my-4"></hr>
              <p>{item.description}</p>
              <hr className="my-4"></hr>
              <div className="flex">
                <Image
                  src=""
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
              <h2 className="text-xl font-bold">Recent Reviews</h2>
              <div className="flex my-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                <p> by reviewer</p>
              </div>
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
