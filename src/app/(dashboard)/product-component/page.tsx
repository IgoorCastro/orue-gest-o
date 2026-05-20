"use client";

import { useEffect, useState } from "react";
import { ProductComponent } from "@/src/ui/types/product-component";
import { productComponentService } from "@/src/ui/services/product-component.service";

export default function UsersPage() {
  const [productComponents, setProductComponent] = useState<ProductComponent[]>([]);

  useEffect(() => {
  productComponentService.findAll()
    .then((res) => {
      setProductComponent(res);
    })
    .catch(console.error);
}, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Composição de produtos</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Produto principal</th>
            <th className="p-2 border">Composição</th>
            <th className="p-2 border">Quantidade</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {productComponents.map((pc) => (
            <tr key={pc.id}>
              <td className="p-2 border">{pc.parentProductId}</td>
              <td className="p-2 border" >{pc.componentProductId}</td>
              <td className="p-2 border" > {pc.quantity}</td>              
              <td className="p-2 border text-center">{pc.deletedAt ? `Deletado em ${pc.deletedAt}` : "Ativo"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}