import { drizzle } from "drizzle-orm/mysql2";
import { organizations } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

async function updateChamberSocialMedia() {
  console.log("Adding social media links to NJ Chambers...\n");

  const chamberSocialMedia = [
    {
      slug: "atlantic-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/atlantic-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/AtlanticCountyChamber",
      twitterUrl: "https://twitter.com/ACChamberNJ",
      instagramUrl: "https://www.instagram.com/atlanticcountychamber",
    },
    {
      slug: "bergen-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/bergen-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/BergenChamber",
      twitterUrl: "https://twitter.com/BergenChamber",
      instagramUrl: "https://www.instagram.com/bergenchamber",
    },
    {
      slug: "burlington-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/burlington-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/BurlingtonCountyChamber",
      twitterUrl: "https://twitter.com/BCCoCNJ",
      instagramUrl: "https://www.instagram.com/burlingtoncountychamber",
    },
    {
      slug: "camden-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/camden-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/CamdenCountyChamber",
      twitterUrl: "https://twitter.com/CamdenChamber",
      instagramUrl: "https://www.instagram.com/camdencountychamber",
    },
    {
      slug: "cape-may-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/cape-may-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/CapeMayCountyChamber",
      twitterUrl: "https://twitter.com/CapeMayChamber",
      instagramUrl: "https://www.instagram.com/capemaycountychamber",
    },
    {
      slug: "cumberland-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/cumberland-county-chamber-of-commerce-nj",
      facebookUrl: "https://www.facebook.com/CumberlandNJChamber",
      twitterUrl: "https://twitter.com/CumberlandNJ",
      instagramUrl: "https://www.instagram.com/cumberlandnjchamber",
    },
    {
      slug: "essex-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/essex-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/EssexCountyChamber",
      twitterUrl: "https://twitter.com/EssexChamber",
      instagramUrl: "https://www.instagram.com/essexcountychamber",
    },
    {
      slug: "gloucester-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/gloucester-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/GloucesterCountyChamber",
      twitterUrl: "https://twitter.com/GloucesterCoNJ",
      instagramUrl: "https://www.instagram.com/gloucestercountychamber",
    },
    {
      slug: "hudson-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/hudson-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/HudsonChamber",
      twitterUrl: "https://twitter.com/HudsonChamber",
      instagramUrl: "https://www.instagram.com/hudsonchamber",
    },
    {
      slug: "hunterdon-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/hunterdon-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/HunterdonChamber",
      twitterUrl: "https://twitter.com/HunterdonChamb",
      instagramUrl: "https://www.instagram.com/hunterdonchamber",
    },
    {
      slug: "mercer-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/mercer-regional-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/MercerChamber",
      twitterUrl: "https://twitter.com/MercerChamber",
      instagramUrl: "https://www.instagram.com/mercerchamber",
    },
    {
      slug: "middlesex-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/middlesex-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/MiddlesexCountyChamber",
      twitterUrl: "https://twitter.com/MiddlesexCoNJ",
      instagramUrl: "https://www.instagram.com/middlesexcountychamber",
    },
    {
      slug: "monmouth-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/monmouth-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/MonmouthChamber",
      twitterUrl: "https://twitter.com/MonmouthChamber",
      instagramUrl: "https://www.instagram.com/monmouthchamber",
    },
    {
      slug: "morris-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/morris-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/MorrisChamber",
      twitterUrl: "https://twitter.com/MorrisChamber",
      instagramUrl: "https://www.instagram.com/morrischamber",
    },
    {
      slug: "ocean-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/ocean-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/OceanCountyChamber",
      twitterUrl: "https://twitter.com/OceanCoChamber",
      instagramUrl: "https://www.instagram.com/oceancountychamber",
    },
    {
      slug: "passaic-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/passaic-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/PassaicChamber",
      twitterUrl: "https://twitter.com/PassaicChamber",
      instagramUrl: "https://www.instagram.com/passaicchamber",
    },
    {
      slug: "salem-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/salem-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/SalemCountyChamber",
      twitterUrl: "https://twitter.com/SalemCoChamber",
      instagramUrl: "https://www.instagram.com/salemcountychamber",
    },
    {
      slug: "somerset-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/somerset-county-business-partnership",
      facebookUrl: "https://www.facebook.com/SomersetBusinessPartnership",
      twitterUrl: "https://twitter.com/SomersetBizPart",
      instagramUrl: "https://www.instagram.com/somersetbusinesspartnership",
    },
    {
      slug: "sussex-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/sussex-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/SussexCountyChamber",
      twitterUrl: "https://twitter.com/SussexChamber",
      instagramUrl: "https://www.instagram.com/sussexcountychamber",
    },
    {
      slug: "union-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/gateway-regional-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/GatewayChamber",
      twitterUrl: "https://twitter.com/GatewayChamber",
      instagramUrl: "https://www.instagram.com/gatewaychamber",
    },
    {
      slug: "warren-county-chamber",
      linkedinUrl: "https://www.linkedin.com/company/warren-county-chamber-of-commerce",
      facebookUrl: "https://www.facebook.com/WarrenCountyChamber",
      twitterUrl: "https://twitter.com/WarrenCoChamber",
      instagramUrl: "https://www.instagram.com/warrencountychamber",
    },
  ];

  for (const chamber of chamberSocialMedia) {
    try {
      await db
        .update(organizations)
        .set({
          linkedinUrl: chamber.linkedinUrl,
          facebookUrl: chamber.facebookUrl,
          twitterUrl: chamber.twitterUrl,
          instagramUrl: chamber.instagramUrl,
          tiktokUrl: chamber.tiktokUrl || null,
        })
        .where(eq(organizations.slug, chamber.slug));

      console.log(`✅ Updated social media for: ${chamber.slug}`);
    } catch (error) {
      console.error(`❌ Error updating ${chamber.slug}:`, error);
    }
  }

  console.log("\n✅ All Chamber social media links updated successfully!");
}

updateChamberSocialMedia().catch(console.error);
