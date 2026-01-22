import { describe, it, expect } from "vitest";
import { getLocationFromIP, findClosestChamber } from "./geolocation";

describe("Location Detection and Chamber Matching", () => {
  it("should detect location from IP address", async () => {
    // Test with localhost (should return default Wildwood, NJ)
    const location = await getLocationFromIP("127.0.0.1");
    
    expect(location).toBeDefined();
    expect(location.city).toBe("Wildwood");
    expect(location.state).toBe("NJ");
    expect(location.latitude).toBe(38.9918);
    expect(location.longitude).toBe(-74.8149);
  });

  it("should find closest Chamber based on coordinates", () => {
    const mockChambers = [
      {
        id: 1,
        name: "Atlantic County Chamber of Commerce",
        nameEs: "Cámara de Comercio del Condado de Atlantic",
        slug: "atlantic-county-chamber",
        city: "Atlantic City",
        state: "NJ",
        description: "Supporting businesses in Atlantic County",
        descriptionEs: "Apoyando negocios en el Condado de Atlantic",
        website: "https://www.atlanticcountychamber.com",
        signupUrl: "https://www.atlanticcountychamber.com/membership",
        logoUrl: null,
        primaryColor: "#0EA5E9",
        linkedinUrl: "https://www.linkedin.com/company/atlantic-county-chamber-of-commerce",
        facebookUrl: "https://www.facebook.com/AtlanticCountyChamber",
        twitterUrl: "https://twitter.com/ACChamberNJ",
        instagramUrl: "https://www.instagram.com/atlanticcountychamber",
        tiktokUrl: null,
      },
      {
        id: 2,
        name: "Salem County Chamber of Commerce",
        nameEs: "Cámara de Comercio del Condado de Salem",
        slug: "salem-county-chamber",
        city: "Salem",
        state: "NJ",
        description: "Promoting economic development in Salem County",
        descriptionEs: "Promoviendo el desarrollo económico en el Condado de Salem",
        website: "https://www.salemcountychamber.com",
        signupUrl: "https://www.salemcountychamber.com/membership",
        logoUrl: null,
        primaryColor: "#F97316",
        linkedinUrl: "https://www.linkedin.com/company/salem-county-chamber-of-commerce",
        facebookUrl: "https://www.facebook.com/SalemCountyChamber",
        twitterUrl: "https://twitter.com/SalemCoChamber",
        instagramUrl: "https://www.instagram.com/salemcountychamber",
        tiktokUrl: null,
      },
    ];

    // Test with coordinates near Atlantic City, NJ (39.3643, -74.4229)
    const closestChamber = findClosestChamber(39.3643, -74.4229, mockChambers);

    expect(closestChamber).toBeDefined();
    expect(closestChamber?.name).toBe("Atlantic County Chamber of Commerce");
    expect(closestChamber?.distance).toBeDefined();
    expect(closestChamber?.distance).toBeGreaterThanOrEqual(0);
  });

  it("should include social media links in Chamber data", () => {
    const mockChambers = [
      {
        id: 1,
        name: "Test Chamber",
        nameEs: "Cámara de Prueba",
        slug: "test-chamber",
        city: "Newark",
        state: "NJ",
        description: "Test description",
        descriptionEs: "Descripción de prueba",
        website: "https://www.testchamber.com",
        signupUrl: "https://www.testchamber.com/join",
        logoUrl: null,
        primaryColor: "#ff006e",
        linkedinUrl: "https://www.linkedin.com/company/test-chamber",
        facebookUrl: "https://www.facebook.com/TestChamber",
        twitterUrl: "https://twitter.com/TestChamber",
        instagramUrl: "https://www.instagram.com/testchamber",
        tiktokUrl: "https://www.tiktok.com/@testchamber",
      },
    ];

    // Test with Newark coordinates (40.7357, -74.1724)
    const chamber = findClosestChamber(40.7357, -74.1724, mockChambers);

    expect(chamber).toBeDefined();
    expect(chamber?.linkedinUrl).toBe("https://www.linkedin.com/company/test-chamber");
    expect(chamber?.facebookUrl).toBe("https://www.facebook.com/TestChamber");
    expect(chamber?.twitterUrl).toBe("https://twitter.com/TestChamber");
    expect(chamber?.instagramUrl).toBe("https://www.instagram.com/testchamber");
    expect(chamber?.tiktokUrl).toBe("https://www.tiktok.com/@testchamber");
  });

  it("should handle Chambers with missing social media links", () => {
    const mockChambers = [
      {
        id: 1,
        name: "Minimal Chamber",
        nameEs: "Cámara Mínima",
        slug: "minimal-chamber",
        city: "Trenton",
        state: "NJ",
        description: "Minimal description",
        descriptionEs: "Descripción mínima",
        website: "https://www.minimalchamber.com",
        signupUrl: "https://www.minimalchamber.com/join",
        logoUrl: null,
        primaryColor: "#6366F1",
        linkedinUrl: "https://www.linkedin.com/company/minimal-chamber",
        facebookUrl: null, // No Facebook
        twitterUrl: null, // No Twitter
        instagramUrl: null, // No Instagram
        tiktokUrl: null, // No TikTok
      },
    ];

    // Test with Trenton coordinates (40.2171, -74.7429)
    const chamber = findClosestChamber(40.2171, -74.7429, mockChambers);

    expect(chamber).toBeDefined();
    expect(chamber?.linkedinUrl).toBe("https://www.linkedin.com/company/minimal-chamber");
    expect(chamber?.facebookUrl).toBeNull();
    expect(chamber?.twitterUrl).toBeNull();
    expect(chamber?.instagramUrl).toBeNull();
    expect(chamber?.tiktokUrl).toBeNull();
  });

  it("should calculate distance correctly", () => {
    const mockChambers = [
      {
        id: 1,
        name: "Newark Chamber",
        nameEs: "Cámara de Newark",
        slug: "newark-chamber",
        city: "Newark",
        state: "NJ",
        description: "Newark description",
        descriptionEs: "Descripción de Newark",
        website: "https://www.newarkchamber.com",
        signupUrl: "https://www.newarkchamber.com/join",
        logoUrl: null,
        primaryColor: "#7C3AED",
        linkedinUrl: null,
        facebookUrl: null,
        twitterUrl: null,
        instagramUrl: null,
        tiktokUrl: null,
      },
    ];

    // Test with coordinates very close to Newark (40.7357, -74.1724)
    const chamber = findClosestChamber(40.7357, -74.1724, mockChambers);

    expect(chamber).toBeDefined();
    expect(chamber?.distance).toBeDefined();
    // Distance should be very small (less than 1 mile) since we're using Newark's exact coordinates
    expect(chamber?.distance).toBeLessThan(1);
  });

  it("should return null when no Chambers are provided", () => {
    const chamber = findClosestChamber(40.7357, -74.1724, []);
    expect(chamber).toBeNull();
  });
});
