import readline from "readline";

// ---------------- OFFER RULES ----------------
const OFFER_RULES = {
  OFR001: { discount: 10, minWeight: 70, maxWeight: 200, minDist: 0, maxDist: 200 },
  OFR002: { discount: 7, minWeight: 100, maxWeight: 250, minDist: 50, maxDist: 150 },
  OFR003: { discount: 5, minWeight: 10, maxWeight: 150, minDist: 50, maxDist: 250 },
};

// ---------------- CORE FUNCTIONS ----------------

export function calculateBaseCost(baseCost, weight, distance) {
  return baseCost + weight * 10 + distance * 5;
}

export function calculateDiscount(pkg, deliveryCost) {
  const offer = OFFER_RULES[pkg.offerCode];
  if (!offer) return 0;

  const weightOk = pkg.weight >= offer.minWeight && pkg.weight <= offer.maxWeight;
  const distanceOk = pkg.distance >= offer.minDist && pkg.distance <= offer.maxDist;

  return weightOk && distanceOk ? (deliveryCost * offer.discount) / 100 : 0;
}

export function calculateTotalCost(baseCost, pkg) {
  const deliveryCost = calculateBaseCost(baseCost, pkg.weight, pkg.distance);
  const discount = calculateDiscount(pkg, deliveryCost);
  const total = deliveryCost - discount;

  return {
    ...pkg,
    discount: +discount.toFixed(2),
    total: +total.toFixed(2),
  };
}

export function estimateDeliveryTimes(packages, vehicleCount, maxSpeed, maxWeight) {
  const availableAt = Array(vehicleCount).fill(0);
  const result = [];
  let remaining = [...packages];

  while (remaining.length > 0) {
    // Sort: heavier first, then shorter distance
    remaining.sort((a, b) => b.weight - a.weight || a.distance - b.distance);

    let shipment = [];
    let totalWeight = 0;

    for (const pkg of remaining) {
      if (totalWeight + pkg.weight <= maxWeight) {
        shipment.push(pkg);
        totalWeight += pkg.weight;
      }
    }

    if (shipment.length === 0) break;

    const nextVehicle = availableAt.indexOf(Math.min(...availableAt));
    const startTime = availableAt[nextVehicle];
    const longestDistance = Math.max(...shipment.map((p) => p.distance));
    const tripTime = longestDistance / maxSpeed;

    shipment.forEach((pkg) => {
      pkg.estimatedTime = +(startTime + tripTime).toFixed(2);
      result.push(pkg);
    });

    availableAt[nextVehicle] = +(startTime + 2 * tripTime).toFixed(2);
    remaining = remaining.filter((p) => !shipment.includes(p));
  }

  return result.sort((a, b) => a.id.localeCompare(b.id));
}

// ---------------- CLI INTERFACE ----------------

if (import.meta.url === `file://${process.argv[1]}`) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("🚚 Welcome to the Courier Service CLI!");
  console.log("👉 Follow the instructions below to calculate costs & times.\n");

  const lines = [];

  const askBaseInfo = () => {
    rl.question(
      "Step 1️⃣  → Enter base_delivery_cost and number_of_packages (e.g., '100 3'): ",
      (line) => {
        if (!line.trim()) return askBaseInfo();
        lines.push(line.trim());
        const [, pkgCount] = line.trim().split(" ").map(Number);
        askPackageDetails(pkgCount);
      }
    );
  };

  const askPackageDetails = (count, current = 1) => {
    if (current > count) return askVehicleDetails();
    rl.question(
      `Step 2️⃣  → Enter details for package ${current} (format: pkg_id weight_kg distance_km offer_code or 'NA'): `,
      (line) => {
        if (!line.trim()) return askPackageDetails(count, current);
        lines.push(line.trim());
        askPackageDetails(count, current + 1);
      }
    );
  };

  const askVehicleDetails = () => {
    rl.question(
      "Step 3️⃣  → (Optional) Enter number_of_vehicles max_speed(km/hr) max_weight(kg) — or press Enter to skip: ",
      (line) => {
        if (line.trim()) lines.push(line.trim());
        rl.close();
      }
    );
  };

  rl.on("close", () => {
    console.log("\n📦 Calculating results...\n");

    const [baseCost, noOfPackages] = lines[0].split(" ").map(Number);

    const packages = [];
    for (let i = 1; i <= noOfPackages; i++) {
      const [id, w, d, offer] = lines[i].split(" ");
      packages.push({ id, weight: +w, distance: +d, offerCode: offer });
    }

    const enriched = packages.map((p) => calculateTotalCost(baseCost, p));

    // Optional vehicle info line
    if (lines.length > noOfPackages + 1) {
      const [vehicles, speed, capacity] = lines[noOfPackages + 1].split(" ").map(Number);
      const withTimes = estimateDeliveryTimes(enriched, vehicles, speed, capacity);

      console.log("🕒 Estimated Delivery Times:");
      withTimes.forEach((p) =>
        console.log(`${p.id} → Discount: ${p.discount} | Cost: ${p.total} | Time: ${p.estimatedTime} hrs`)
      );
    } else {
      console.log("💰 Delivery Cost Summary:");
      enriched.forEach((p) => console.log(`${p.id} → Discount: ${p.discount} | Total: ${p.total}`));
    }

    console.log("\n✅ Done! Thanks for using the Courier Service CLI.\n");
  });

  askBaseInfo();
}
