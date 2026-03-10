type Props = {
	tags: string[];
};

export default function TagList({ tags }: Props) {
	return (
		<div className="flex flex-wrap gap-1.5">
			{tags.map((tag) => (
				<div
					key={tag}
					className="text-xs px-2 py-0.5 rounded-full bg-(--tag-bg) text-(--tag-text) border border-(--tag-border)"
				>
					#{tag}
				</div>
			))}
		</div>
	);
}
