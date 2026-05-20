import { Material } from "@/src/ui/types/material";
import { useEffect, useState } from "react";

export function useMaterialForm(initalData?: Material) {
  const [name, setName] = useState("");

  useEffect(() => {initalData && setName(initalData.name)}, [initalData])

  return {
    // fields
    name,

    // setters
    setName,
  };
}
