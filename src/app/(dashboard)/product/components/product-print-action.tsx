// componente responsável por mapear os dados para etiqueta

"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { Button } from "@/src/ui/components/ui/button";
import { LabelPrint } from "./label-print"; // componente que monta a etiqueta
import { Product } from "@/src/ui/types/product";

interface ProductPrintActionProps {
    product: Product;
    compositions?: any[]; // Passamos os dados que você já buscou no hook
}

export function ProductPrintAction({ product, compositions }: ProductPrintActionProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Etiqueta-${product.sku}`,
    });

    const labelData = {
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        size: product.size,
        colors: product.productColor.map(c => c.color.name),
        totalItems: compositions?.reduce((acc, curr) => acc + curr.quantity, 0),
        type: product.type,
        composition: compositions?.map((c) => ({
            quantity: c.quantity,
            name: c.componentProduct.name,
            size: c.componentProduct.size,
            color: c.componentProduct.productColor?.[0]?.color?.name, // Pegando a primeira cor se houver
        })),
    };

    return (
        <>
            <Button
                onClick={() => handlePrint()}
                variant="default"
                size="sm"
                className="flex gap-2 w-min md:w-auto"
            >
                <Printer className="w-4 h-4" />
                <p className="hidden sm:block">Imprimir Etiqueta</p>
            </Button>

            {/* Container Invisível */}
            <div className="hidden">
                <div ref={contentRef}>
                    <LabelPrint
                        data={labelData}
                        type={product.type === "KIT" ? "KIT" : "PRODUCT"}
                    />
                </div>
            </div>
        </>
    );
}