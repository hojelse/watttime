import { Suspense } from "react";
import { InteractiveChart } from "./components/InteractiveChart";
import { getData } from "./api/get_data";

export default async function Home() {

  const dataEntries = await getData()

  return <>
    <div
      className="page"
      style={{
        width: "100vw",
        backgroundColor: "var(--color-background)",
      }}
    >
      <InteractiveChart dataEntries={dataEntries}/>
    </div>
  </>
}
