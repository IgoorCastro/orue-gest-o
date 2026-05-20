// hook de estados responsável por gerenciar o ciclo de vida dos componentes

import { User } from "@/src/ui/types/user";
import { useState } from "react";

export function useUserPageState() {

  const [openCrudModal, setOpenCrudModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [openItemModal, setOpenItemModal] = useState(false);

  const openEditModal = (user: User): void => {
    setSelectedUser(user);
    setOpenCrudModal(true);
  }

  // Abre a modal e limpa o estado
  const openCreateModal = () => {
    setSelectedUser(undefined);
    setOpenCrudModal(true);
  }

  // controle da modal de exibição do estoque
  const openItemDetails = (user: User): void => {
    setSelectedUser(user);
    setOpenItemModal(true);
  }

  return {
    // campos
    openCrudModal,
    selectedUser,
    openItemModal,

    // setters
    setOpenCrudModal,
    setOpenItemModal,

    //utils
    openEditModal,
    openCreateModal,
    openItemDetails,
  }
}