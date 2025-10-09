"use server";
import { createClient } from "@/utils/supabase/server";

export async function report(formData: FormData) {
  /*
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("reports")
    .select()
    .eq("profile", 1);
  console.log(reports);
*/
  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    item: formData.get("itemID"),
    profile: "11111111 - 1111 - 4111 - 8111 - 111111111111",
  });
}
