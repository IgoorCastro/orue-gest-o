// retorna toda dependencia necessaria para criar um novo produto
// loading disponivel

import { useEffect, useMemo, useState } from "react";
import { ModelService } from "@/src/ui/services/model.service";
import { ColorService } from "@/src/ui/services/color.service";
import { MaterialService } from "@/src/ui/services/material.service";

import { Model } from "@/src/ui/types/model";
import { Color } from "@/src/ui/types/color";
import { Material } from "@/src/ui/types/material";
import { PaginatedProduct } from "@/src/ui/types/product";
import { ProductService } from "@/src/ui/services/product.service";

export function useProductDependencies() {
    const [models, setModels] = useState<Model[]>([]); // modelos
    const [colors, setColors] = useState<Color[]>([]); // cores
    const [materials, setMaterials] = useState<Material[]>([]); // materiais
    const [products, setProducts] = useState<PaginatedProduct>({ data: [], limit: 0, page: 0, total: 0 }); // produtos com paginação
    const [loading, setLoading] = useState(true); // loading dos dados

    const colorService = useMemo(() => new ColorService("/color"), []);
    const materialService = useMemo(() => new MaterialService("/material"), []);
    const modelService = useMemo(() => new ModelService("/model"), []);
    const productService = useMemo(() => new ProductService("/product"), []);

    useEffect(() => {
        async function load() {
            try {
                const [modelsRes, colorsRes, materialsRes, productRes] = await Promise.all([
                    modelService.findAll(),
                    colorService.findAll(),
                    materialService.findAll(),
                    productService.findAll(),
                ]);
                
                setModels(modelsRes);
                setColors(colorsRes);
                setMaterials(materialsRes);
                setProducts(productRes);
            } catch (error) {
                console.error("Erro ao carregar dependências", error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return {
        models,
        colors,
        materials,
        products,
        loading,
    };
}