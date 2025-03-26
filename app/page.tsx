import Link from "next/link";
import { redirect } from "next/navigation";
import dbconnect, { pool } from "./utils/dbconnect";

export interface Note {
  id: number;
  skill: string;
  decp: string;
}
export default async function Home() {

  await dbconnect();

  // Create Note
  async function createNote(formData: FormData) {
    "use server"; 

    const skill = formData.get("skill")?.toString();
    const decp = formData.get("decp")?.toString();

    try {
      const newNote = await pool.query(
        "INSERT INTO notes (skill, decp) VALUES ($1, $2) RETURNING *",
        [skill, decp]
      );
      console.log("Note Created:", newNote.rows[0]);
    } catch (error) {
      console.error("Error creating note:", error);
    }

    redirect("/");
  }

  // Read Notes
  const data = await pool.query("SELECT * FROM notes");
  const result = data.rows;

  // Delete Note
  async function deleteNote(formData: FormData) {
    "use server"; // Correct directive

    const id = formData.get("id")?.toString();

    try {
      await pool.query("DELETE FROM notes WHERE id = $1", [id]);
      console.log("Note deleted:", id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }

    redirect("/");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold my-8">Technical Skills</h1>

      {/* Create Note Form */}
      <form action={createNote} className="flex gap-3 flex-col mb-6">
        <input
          type="text"
          name="skill"
          placeholder="Skill"
          className="py-1 px-4 border rounded-md"
          required
        />

        <textarea
          name="decp"
          rows={4}
          placeholder="Description"
          className="py-1 px-4 border rounded-md resize-none"
          required
        ></textarea>

        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded-md cursor-pointer"
        >
          Add Skill
        </button>
      </form>
      {result.map((note:Note) => (
        <div key={note.id} className="p-4 my-2 rounded-md border-b leading-8">
          <div className="font-bold text-lg">{note.skill}</div>
          <div className="text-sm font-serif">{note.decp}</div>

          <div className="flex gap-4 mt-4 justify-end">
            <Link
              className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
              href={`/edit/${note.id}`}
            >
              Edit
            </Link>

            <form action={deleteNote}>
              <input type="hidden" name="id" value={note.id} />
              <button
                type="submit"
                className="bg-pink-600 text-white px-4 py-2 rounded-sm uppercase font-bold tracking-widest"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
