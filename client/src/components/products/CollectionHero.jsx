import { Link } from "react-router-dom";
import { tw } from "../../utils/twStyles.js";

const CollectionHero = ({ hero, parentCategory }) => (
  <section className={tw("vanta-catalog-banner vanta-collection-hero !h-[235px] max-[640px]:!h-[220px]")}>
    <img src={hero.image} alt="" />

    <div className={tw("vanta-collection-hero-overlay")} />

    <div className={tw("vanta-collection-hero-copy !w-full !max-w-[1280px] !mx-auto !left-0 !right-0 !px-6 sm:!px-10 lg:!px-14")}>
      <div>
        <div className={tw("mb-3 flex items-center gap-2 text-[9px] text-white/70")}>
          <Link to="/" className={tw("hover:text-white")}>Home</Link>
          <span>›</span>
          <Link to="/category" className={tw("hover:text-white")}>Collections</Link>

          {parentCategory && (
            <>
              <span>›</span>
              <Link to={`/category/${parentCategory.slug}`} className={tw("hover:text-white")}>
                {parentCategory.name}
              </Link>
            </>
          )}

          <span>›</span>
          <strong className="font-semibold text-white">{hero.title}</strong>
        </div>

        <h1 className="font-serif text-4xl font-normal tracking-tight sm:text-6xl">{hero.title}</h1>
        {hero.subtitle && <p className="mt-3 text-sm text-white/85">{hero.subtitle}</p>}
      </div>
    </div>
  </section>
);

export default CollectionHero;
