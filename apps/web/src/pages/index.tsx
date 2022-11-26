import { TimezonePicker } from "@hammertime/ui";
import { NextPage } from "next";

const IndexPage: NextPage = () => {
  return (
    <div>
      <h1>Web</h1>
      <TimezonePicker />
    </div>
  );
}

export default IndexPage;
