import Image from "next/image";
import { ideas } from "./data/ideas";
import Ideas from "@/components/Ideas";

export default function Home() {
  return (
    <div className="">
      
      <Ideas ideas={ideas}/>

    </div>
  );
}
