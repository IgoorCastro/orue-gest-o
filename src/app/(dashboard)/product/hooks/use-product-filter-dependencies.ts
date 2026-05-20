import { ColorService } from "@/src/ui/services/color.service";
import { MaterialService } from "@/src/ui/services/material.service";
import { Color } from "@/src/ui/types/color";
import { Material } from "@/src/ui/types/material";
import { useEffect, useMemo, useState } from "react";

export function useProductFilterDependencies() {
    const [colors, setColors] = useState<Color[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const colorService = useMemo(() =>  new ColorService("/color"), []);
    const materialService = useMemo(() =>  new MaterialService("/material"), []);

    useEffect(() => {
        async function load() {
            try {
                // SERVICES
                const [colors, materials] = await Promise.all([
                    colorService.findAll(),
                    materialService.findAll(),
                ])

                setColors(colors);
                setMaterials(materials);
            } catch (error) {
                console.error("Erro ao carregar dependências", error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return {
        colors,
        materials,
        loading,
    }
}