// retorna uma string com a primeira letra maiúscula

export function capitalizeFirstLetter( value : string) {
    return value?.trim() ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}