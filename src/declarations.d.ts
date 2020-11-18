declare module "*.pug" {
	export default function (locals?: object): string;
}

declare module "*.css" {
	// raw-loader
	export function toString(): string;
}
