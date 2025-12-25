import { GridLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex h-screen w-screen justify-center items-center bg-[#EAF6EA8D]">
      <GridLoader color="#0096FF" />
    </div>
  );
}
