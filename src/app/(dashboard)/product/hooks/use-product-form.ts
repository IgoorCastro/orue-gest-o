import { useEffect, useState } from "react";
import { Color } from "@/src/ui/types/color";
import { Material } from "@/src/ui/types/material";
import { Product } from "@/src/ui/types/product";

export enum ProductType {
  PRODUCT = "PRODUCT",
  KIT = "KIT",
  PACKAGE = "PACKAGE",
}

export enum ProductSize {
  P = "P",
  M = "M",
  G = "G",
  GG = "GG",
  XG = "XG",
}

export type SelectedProduct = Product & { quantity: number };

export function useProductForm(initialDataToProduct?: Product, initialDataToOthers?: { parentProduct: Product, componentProduct: SelectedProduct, }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [type, setType] = useState<ProductType>(ProductType.PRODUCT);
  const [size, setSize] = useState<ProductSize | "">("");
  const [mlProductId, setMlProductId] = useState("");

  const [model, setModel] = useState<string>("");

  const [colors, setColors] = useState<Color[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedComponentsProducts, setSelectedComponentsProducts] = useState<SelectedProduct[]>([]);

  useEffect(() => {
    if (initialDataToProduct) mapDataToProduct(initialDataToProduct);
  }, [initialDataToProduct])

  const mapDataToProduct = (product: Product): void => {
    setName(product.name);
    setPrice(product.price);
    setType(product.type as ProductType);
    setSize(product.size as ProductSize);
    setMlProductId(product.mlProductId ?? "");

    setModel(product.modelId ?? "");

    setColors(product.productColor.map(pc => pc.color));
    setMaterials(product.productMaterial.map(pm => pm.material))
  }

  return {
    // fields
    name,
    price,
    type,
    size,
    mlProductId,
    model,
    colors,
    materials,
    selectedComponentsProducts,

    // setters
    setName,
    setPrice,
    setType,
    setSize,
    setMlProductId,
    setSelectedComponentsProducts,
    setModel,
    setColors,
    setMaterials,
  };
}