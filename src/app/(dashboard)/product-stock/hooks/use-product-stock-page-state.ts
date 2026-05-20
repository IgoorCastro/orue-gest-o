// hook para controle de estados

import { useState } from "react";

export function useProductStockPageState() {    
  const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);

  return {
    openFilterModal,

    setOpenFilterModal,
  }
}