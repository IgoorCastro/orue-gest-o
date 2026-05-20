// import { ProductRepository } from "@/src/domain/repositories/product.repository";
// import { FindProductBySizeInputDto, FindProductOutputDto } from "../dto/product-find.dto";

// type FindProductBySizeProps = {
//     size: string,
// }

// export class FindProductBySizeUseCase {
//     constructor(
//         private productRepository: ProductRepository,
//     ) { }

//     async execute(input: FindProductBySizeInputDto): Promise<FindProductOutputDto[]> {
//         if (!input.size?.trim()) throw new Error("Product size cannot be empty");
//         const products = await this.productRepository.findBySize(input.size);

//         return products.map(p => ({
//             id: p.id,
//             name: p.name,
//             price: p.price,
//             type: p.type,
//             size: p.size,
//             colorIds: p.colors,
//             materialIds: p.materials,
//             modelId: p.modelId,
//             sku: p.sku,
//             barcode: p.barcode,
//             mlProductId: p.mlProductId,
//         }));
//     }
// }