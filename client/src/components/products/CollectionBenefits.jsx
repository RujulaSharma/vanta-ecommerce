import { Headphones, ShieldCheck, Truck } from "lucide-react";
import { tw } from "../../utils/twStyles.js";

const BENEFITS = [
  [Truck, "Free Shipping", "On orders of ₹2,000 or more"],
  [ShieldCheck, "Secure Payment", "Powered by Razorpay"],
  [Headphones, "Customer Support", "Order assistance"],
];

const CollectionBenefits = () => (
  <section className={tw("vanta-collection-benefits")}>
    {BENEFITS.map(([Icon, title, text]) => (
      <div key={title}>
        <Icon size={27} strokeWidth={1.5} />
        <div>
          <strong>{title}</strong>
          <span>{text}</span>
        </div>
      </div>
    ))}
  </section>
);

export default CollectionBenefits;
