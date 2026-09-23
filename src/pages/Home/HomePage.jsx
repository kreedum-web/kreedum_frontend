import {
  Button,
  Input,
  Badge,
  Loader,
  SectionTitle,
  EmptyState,
} from "../../components/common";

export default function HomePage() {
  return (
    <div className="p-10 space-y-10 bg-[#F6F8FC] min-h-screen">

      <SectionTitle
        title="Kreedum UI Design System"
        subtitle="Reusable frontend components"
      />

      <div className="flex gap-4 flex-wrap">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="danger">Danger</Button>
        <Button loading>Loading</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Input label="Email" placeholder="Enter email" />

        <Input
          label="Phone Number"
          placeholder="9876543210"
          error="Invalid phone number"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <Badge type="sale">20% OFF</Badge>
        <Badge type="new">New Arrival</Badge>
        <Badge type="bestseller">Best Seller</Badge>
        <Badge type="stock">Out of Stock</Badge>
      </div>

      <Loader.Spinner />

      <div className="grid md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Loader.ProductSkeleton key={index} />
        ))}
      </div>

      <EmptyState
        title="Wishlist is Empty"
        description="Products you like will appear here."
        action={<Button>Explore Products</Button>}
      />
    </div>
  );
}