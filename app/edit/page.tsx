import { redirect } from "next/navigation";
import dbconnect, { pool } from "../utils/dbconnect";

export default async function EditPage({ params }: { params: { id: string } }) {
  await dbconnect();

  const id = params.id;
  const skill = await pool.query("SELECT * FROM skill WHERE id = $1", [id]);

  if (skill.rows.length === 0) {
    return <p className="text-red-500">Skill not found</p>;
  }

  const result = skill.rows[0];

  async function updateNote(formData: FormData) {
    "use server"; // Correct directive

    const id = formData.get("id")?.toString() || "";
    const skill = formData.get("skill")?.toString() || "";
    const decp = formData.get("decp")?.toString() || "";

    try {
      await pool.query(
        "UPDATE skill SET skill = $1, decp = $2 WHERE id = $3",
        [skill, decp, id]
      );
      console.log(`Updated skill:`, skill);
      
      await new Promise((resolve) => setTimeout(resolve, 100)); 
      redirect("/");
    } catch (err) {
      console.error("Error in updating:", err);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Edit Technical Skill</h2>
      <form action={updateNote} className="flex gap-3 flex-col">
        <input type="hidden" name="id" value={id} />

        <input
          type="text"
          name="skill"
          placeholder="Skill"
          defaultValue={result.skill}
          className="py-1 px-4 border rounded-md"
          required
        />

        <textarea
          name="decp"
          rows={4}
          placeholder="Description"
          defaultValue={result.decp}
          className="py-1 px-4 border rounded-md resize-none"
          required
        ></textarea>

        <button
          type="submit"
          className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
        >
          Update Description
        </button>
      </form>
    </div>
  );
}
