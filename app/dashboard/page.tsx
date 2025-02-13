import DeleteModal from "@/components/DeleteModal";
import Dropzone from "@/components/Dropzone";
import RenameModal from "@/components/RenameModal";
import TableWrapper from "@/components/table/TableWrapper";

async function Dashboard() {
  return (
    <div className="border-t">
      <Dropzone />

      <DeleteModal />
      <RenameModal />
      <section className="container space-y-5 max-w-6xl mx-auto pb-20">
        <TableWrapper />
      </section>
    </div>
  );
}
export default Dashboard;
