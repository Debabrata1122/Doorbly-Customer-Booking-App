export interface ServiceDefinition {
  name: string;
  slug: string;
  category_name: string;
  category_slug: string;
  description: string;
  partner_hourly_rate: number;
  customer_hourly_price: number;
  commission_percentage: number;
  doorbly_commission: number;
  partner_payout: number;
  minimum_hours: number;
  maximum_hours: number;
}

export interface CategoryDefinition {
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
}

export const CATEGORIES_MASTER: CategoryDefinition[] = [
  { name: "Baby", slug: "baby", description: "Hourly babysitters, infant care, feeding, bathing, bedtime routines, and loving home child care.", icon: "Baby", sort_order: 1 },
  { name: "Elderly Care", slug: "elderly-care", description: "Hourly non-medical companionship, walking, mobility, meal assistance, and personal care for senior citizens.", icon: "HeartHandshake", sort_order: 2 },
  { name: "Home Repair & Maintenance", slug: "home-repair-maintenance", description: "Carpentry, masonry, tile work, drilling, wall mounting, and general structural fixes.", icon: "Wrench", sort_order: 3 },
  { name: "Electrical Services", slug: "electrical-services", description: "Licensed electricians, fan/light installation, inverter, MCB, wiring, and solar technicians.", icon: "Zap", sort_order: 4 },
  { name: "Plumbing & Water", slug: "plumbing-water", description: "Leak repairs, water tank cleaning, bathroom/kitchen pipe fitting, and pump maintenance.", icon: "Droplets", sort_order: 5 },
  { name: "Cleaning & Household", slug: "cleaning-household", description: "Deep cleaning, floor/bathroom sanitization, sofa cleaning, dusting, and senior household help.", icon: "Sparkles", sort_order: 6 },
  { name: "Painting & Decoration", slug: "painting-decoration", description: "Wall putty, interior/exterior painting, spray coating, texture styling, and wallpaper installation.", icon: "Paintbrush", sort_order: 7 },
  { name: "Appliance Services", slug: "appliance-services", description: "AC, refrigerator, washing machine, microwave, geyser, and RO purifier service and repair.", icon: "Tv", sort_order: 8 },
  { name: "Electronics & Technology", slug: "electronics-technology", description: "Computer/laptop repair, Wi-Fi setup, CCTV, smart TV installation, and digital device training.", icon: "Monitor", sort_order: 9 },
  { name: "Agriculture & Farm Work", slug: "agriculture-farm-work", description: "Field preparation, seed sowing, weeding, harvesting, crop maintenance, and farm equipment help.", icon: "Sprout", sort_order: 10 },
  { name: "Gardening & Landscaping", slug: "gardening-landscaping", description: "Lawn maintenance, tree trimming, hedge cutting, terrace/kitchen garden care, and composting.", icon: "Flower2", sort_order: 11 },
  { name: "Livestock & Dairy", slug: "livestock-dairy", description: "Dairy milking assistants, cow/goat/poultry care, animal shed cleaning, and farm animal helpers.", icon: "Footprints", sort_order: 12 },
  { name: "Construction & Skilled Labour", slug: "construction-skilled-labour", description: "Masons, steel & bar bending workers, shuttering, concrete pouring, welding, and site helpers.", icon: "Hammer", sort_order: 13 },
  { name: "Vehicle Services", slug: "vehicle-services", description: "Two-wheeler & car mechanics, tractor repair, puncture fixes, car AC, and doorstep vehicle washing.", icon: "Car", sort_order: 14 },
  { name: "Driving & Local Assistance", slug: "driving-local-assistance", description: "Personal drivers, delivery drivers, local errand assistants, and document pickup helpers.", icon: "Navigation", sort_order: 15 },
  { name: "Moving & Manpower", slug: "moving-manpower", description: "Loading, unloading, furniture shifting, packing/unpacking, and warehouse material handling.", icon: "Package", sort_order: 16 },
  { name: "Home Tutors & Education", slug: "home-tutors-education", description: "Primary/secondary tutors, Math, Science, English, Odia, Hindi, computer, drawing & music teachers.", icon: "GraduationCap", sort_order: 17 },
  { name: "Graphics & Digital Freelance", slug: "graphics-digital-freelance", description: "Graphic designers, video/photo editors, content writers, data entry, typists, and Excel operators.", icon: "Palette", sort_order: 18 },
  { name: "Business & Shop Assistance", slug: "business-shop-assistance", description: "Retail billing assistants, inventory & stock counting, cash counter, sales, and office clerks.", icon: "Store", sort_order: 19 },
  { name: "Event Services", slug: "event-services", description: "Event setup, stage & seating, decoration helpers, catering & serving staff, and wedding helpers.", icon: "PartyPopper", sort_order: 20 },
  { name: "Personal & Family Assistance", slug: "personal-family-assistance", description: "Personal assistants, cooking helpers, meal prep, errand runners, and home organization.", icon: "Users", sort_order: 21 },
  { name: "Beauty & Personal Services", slug: "beauty-personal-services", description: "Doorstep beauticians, bridal makeup, mehndi artists, hair stylists, and saree draping assistants.", icon: "HeartHandshake", sort_order: 22 },
  { name: "Tailoring & Clothing", slug: "tailoring-clothing", description: "Custom tailors, stitching workers, clothing alterations, embroidery, and fashion design assistants.", icon: "Scissors", sort_order: 23 },
  { name: "Handicraft & Home-Based Skills", slug: "handicraft-home-based-skills", description: "Bamboo & cane craft, pottery, decorative items, candle making, and gift packaging artisans.", icon: "Gift", sort_order: 24 },
  { name: "Laundry & Garment Care", slug: "laundry-garment-care", description: "Washing, ironing, clothes folding, drying, sorting, and doorstep shoe/bag cleaning.", icon: "Shirt", sort_order: 25 },
  { name: "Waste & Recycling", slug: "waste-recycling", description: "Dry waste collection, recycling sorting, scrap pickup, garden waste, and eco-segregation.", icon: "Recycle", sort_order: 26 },
  { name: "Rural & Village Services", slug: "rural-village-services", description: "Village helpers, pond cleaning, rural fencing, tractor assistance, and rural logistics helpers.", icon: "Trees", sort_order: 27 },
  { name: "Fishing & Aquaculture", slug: "fishing-aquaculture", description: "Fish farm technicians, pond feeding, net handling, fish sorting, and aquaculture assistance.", icon: "Fish", sort_order: 28 },
  { name: "Security & Property Assistance", slug: "security-property-assistance", description: "Property watchmen, event security helpers, parking assistants, gate watchers, and site guards.", icon: "Shield", sort_order: 29 },
  { name: "Religious & Community Assistance", slug: "religious-community-assistance", description: "Puja preparation helpers, temple event staff, seating arrangement, and food distribution helpers.", icon: "Flame", sort_order: 30 },
  { name: "Emergency & General Assistance", slug: "emergency-general-assistance", description: "Emergency general helpers, storm/flood cleanup, fallen tree clearing, and rapid site support.", icon: "AlertCircle", sort_order: 31 },
  { name: "General Hourly Work", slug: "general-hourly-work", description: "On-demand helpers for household, shop, farm, loading, cleaning, market, and warehouse tasks.", icon: "Clock", sort_order: 32 }
];

// Helper to calculate exact pricing using customer_price = partner_price / 0.80
function createService(
  categoryName: string,
  categorySlug: string,
  name: string,
  slugSuffix: string,
  partnerRate: number,
  description: string,
  minHours: number = 1,
  maxHours: number = 8
): ServiceDefinition {
  const customerPrice = partnerRate / 0.8;
  const doorblyCommission = customerPrice * 0.2;
  const partnerPayout = customerPrice * 0.8;
  return {
    name,
    slug: `${categorySlug}--${slugSuffix}`,
    category_name: categoryName,
    category_slug: categorySlug,
    description,
    partner_hourly_rate: partnerRate,
    customer_hourly_price: customerPrice,
    commission_percentage: 20,
    doorbly_commission: doorblyCommission,
    partner_payout: partnerPayout,
    minimum_hours: minHours,
    maximum_hours: maxHours
  };
}

// Helper to calculate exact pricing for Baby services from customer_hourly_price
function createBabyService(
  name: string,
  slugSuffix: string,
  customerPrice: number,
  description: string,
  minHours: number = 2,
  maxHours: number = 8
): ServiceDefinition {
  const partnerRate = Math.round(customerPrice * 0.8 * 100) / 100;
  const doorblyCommission = Math.round(customerPrice * 0.2 * 100) / 100;
  const partnerPayout = partnerRate;
  return {
    name,
    slug: `baby--${slugSuffix}`,
    category_name: "Baby",
    category_slug: "baby",
    description,
    partner_hourly_rate: partnerRate,
    customer_hourly_price: customerPrice,
    commission_percentage: 20,
    doorbly_commission: doorblyCommission,
    partner_payout: partnerPayout,
    minimum_hours: minHours,
    maximum_hours: maxHours
  };
}

// Helper to calculate exact pricing for Elderly Care services from customer_hourly_price
function createElderlyService(
  name: string,
  slugSuffix: string,
  customerPrice: number,
  description: string,
  minHours: number = 2,
  maxHours: number = 8
): ServiceDefinition {
  const partnerRate = Math.round(customerPrice * 0.8 * 100) / 100;
  const doorblyCommission = Math.round(customerPrice * 0.2 * 100) / 100;
  const partnerPayout = partnerRate;
  return {
    name,
    slug: `elderly-care--${slugSuffix}`,
    category_name: "Elderly Care",
    category_slug: "elderly-care",
    description,
    partner_hourly_rate: partnerRate,
    customer_hourly_price: customerPrice,
    commission_percentage: 20,
    doorbly_commission: doorblyCommission,
    partner_payout: partnerPayout,
    minimum_hours: minHours,
    maximum_hours: maxHours
  };
}

export const SERVICES_MASTER: ServiceDefinition[] = [
  // ==========================================
  // CATEGORY 1 — HOME REPAIR & MAINTENANCE
  // ==========================================
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Carpenter", "carpenter", 400, "Expert woodwork, wooden furniture fitting, hinges, and timber fixtures.", 2),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Furniture Repair Worker", "furniture-repair-worker", 350, "Restoration and structural repair of wooden and composite furniture.", 1),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Furniture Assembly Worker", "furniture-assembly-worker", 300, "Flat-pack and knockdown furniture assembly for beds, tables, and cabinets.", 1),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Door Repair Worker", "door-repair-worker", 300, "Fixing squeaky, jammed, misaligned doors, locks, and latch mechanisms.", 1),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Window Repair Worker", "window-repair-worker", 300, "Sliding window, grill, frame alignment, and glass sash maintenance.", 1),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Lock Repair Worker", "lock-repair-worker", 300, "Repairing door locks, deadbolts, padlocks, and handles.", 1),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Curtain/Rod Installer", "curtain-rod-installer", 250, "Accurate drilling, curtain rod leveling, and track installation.", 1),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Shelf Installer", "shelf-installer", 250, "Floating shelf, corner rack, and wall shelving mounting.", 1),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "TV Wall-Mount Assistant", "tv-wall-mount-assistant", 300, "Secure bracket installation, wall leveling, and TV mounting support.", 1),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Drilling & Wall-Mount Worker", "drilling-wall-mount-worker", 250, "Heavy-duty drilling into concrete, brick, and tile for art, mirrors, and fixtures.", 1),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "False Ceiling Helper", "false-ceiling-helper", 250, "Assistance in gypsum, POP, and grid ceiling installation.", 2),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "POP Worker", "pop-worker", 350, "Plaster of Paris cornice, molding, and wall leveling work.", 2),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Tile Grouting & Floor Repairer", "tile-grouting-floor-repairer", 400, "Floor and wall tile laying, alignment, and tile cutting.", 2),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Marble Worker", "marble-worker", 450, "Marble stone laying, joint fitting, polishing, and cutting.", 2),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Brickwork & Wall Repairer", "brickwork-wall-repairer", 400, "Brickwork, cement mortar construction, and boundary repairs.", 2),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Mortar Mixing & Wall Helper", "mortar-mixing-wall-helper", 250, "Mortar mixing, material hauling, and masonry site support.", 2),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Wall Plaster Patch Worker", "wall-plaster-patch-worker", 350, "Smooth internal and external wall cement plastering.", 2),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Waterproofing Worker", "waterproofing-worker", 400, "Chemical coating and membrane waterproofing for roofs and bathrooms.", 2),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Grouting Worker", "grouting-worker", 300, "Epoxy and cement grout filling for tile joints and wet areas.", 1),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "Flooring Worker", "flooring-worker", 400, "Laying vitrified tiles, wooden flooring, and stone paving.", 2),
  createService("Home Repair & Maintenance", "home-repair-maintenance", "General Home Maintenance Worker", "general-home-maintenance-worker", 300, "All-round handyman support for sundry household repair tasks.", 1),

  // ==========================================
  // CATEGORY 2 — ELECTRICAL SERVICES
  // ==========================================
  createService("Electrical Services", "electrical-services", "Electrician", "electrician", 400, "Certified electrician for diagnostics, heavy wiring, and equipment installation.", 1),
  createService("Electrical Services", "electrical-services", "Electrician Helper", "electrician-helper", 250, "Conduit holding, wire pulling, and electrical support work.", 1),
  createService("Electrical Services", "electrical-services", "Fan Installation Worker", "fan-installation-worker", 300, "Ceiling fan, exhaust fan, and wall fan mounting & testing.", 1),
  createService("Electrical Services", "electrical-services", "Fan Repair Worker", "fan-repair-worker", 300, "Capacitor replacement, bearing lubrication, and regulator fixes.", 1),
  createService("Electrical Services", "electrical-services", "Light Installation Worker", "light-installation-worker", 250, "Tube light, chandelier, and decorative fixture setup.", 1),
  createService("Electrical Services", "electrical-services", "LED Installation Worker", "led-installation-worker", 250, "Cove lighting, LED profile strips, and recessed downlight wiring.", 1),
  createService("Electrical Services", "electrical-services", "Switch/Socket Technician", "switch-socket-technician", 300, "Modular switchboard replacement, earthing test, and socket fixes.", 1),
  createService("Electrical Services", "electrical-services", "Wiring Technician", "wiring-technician", 400, "Full house wiring, short circuit tracing, and rewiring.", 2),
  createService("Electrical Services", "electrical-services", "Inverter Technician", "inverter-technician", 400, "Home inverter setup, battery backup wiring, and load balancing.", 1),
  createService("Electrical Services", "electrical-services", "Home Inverter & Battery Technician", "home-inverter-battery-technician", 350, "Inverter/vehicle battery health check, terminal cleaning, and acid top-up.", 1),
  createService("Electrical Services", "electrical-services", "MCB/DB Technician", "mcb-db-technician", 400, "Distribution box wiring, RCCB safety installation, and breaker checks.", 1),
  createService("Electrical Services", "electrical-services", "CCTV Installation Helper", "cctv-installation-helper", 250, "Assisting in camera mounting, wire routing, and DVR placement.", 1),
  createService("Electrical Services", "electrical-services", "Solar Panel Helper", "solar-panel-helper", 250, "Rooftop structure carrying and solar module alignment help.", 2),
  createService("Electrical Services", "electrical-services", "Solar Technician", "solar-technician", 450, "Rooftop solar panel installation, inverter grid synchronization, and wiring.", 2),
  createService("Electrical Services", "electrical-services", "Electrical Maintenance Worker", "electrical-maintenance-worker", 350, "Scheduled inspection and safety maintenance of electrical circuits.", 1),

  // ==========================================
  // CATEGORY 3 — PLUMBING & WATER
  // ==========================================
  createService("Plumbing & Water", "plumbing-water", "Plumber", "plumber", 400, "Expert plumbing diagnostics, major pipe fittings, and fixture installation.", 1),
  createService("Plumbing & Water", "plumbing-water", "Plumbing Helper", "plumbing-helper", 250, "Trenching, pipe cutting, wrench holding, and plumbing assistance.", 1),
  createService("Plumbing & Water", "plumbing-water", "Tap Repair Worker", "tap-repair-worker", 250, "Fixing dripping taps, cartridge replacement, and valve repairs.", 1),
  createService("Plumbing & Water", "plumbing-water", "Pipe Fitting Worker", "pipe-fitting-worker", 350, "CPVC, UPVC, and GI pipe routing, joints, and leak-proofing.", 1),
  createService("Plumbing & Water", "plumbing-water", "Water Tank Cleaner", "water-tank-cleaner", 300, "Complete sludge removal, scrubbing, and UV disinfection of overhead tanks.", 2),
  createService("Plumbing & Water", "plumbing-water", "Water Tank Maintenance Worker", "water-tank-maintenance-worker", 350, "Float valve fixing, overflow pipe repair, and booster pump checks.", 1),
  createService("Plumbing & Water", "plumbing-water", "Bathroom Plumbing Worker", "bathroom-plumbing-worker", 400, "Shower, commode, health faucet, and diverter installation.", 1),
  createService("Plumbing & Water", "plumbing-water", "Kitchen Plumbing Worker", "kitchen-plumbing-worker", 350, "Sink drain, bottle trap, RO inlet, and faucet plumbing.", 1),
  createService("Plumbing & Water", "plumbing-water", "Drainage Worker", "drainage-worker", 350, "Clearing clogged drain lines, gully traps, and inspection chambers.", 1),
  createService("Plumbing & Water", "plumbing-water", "Leakage Repair Worker", "leakage-repair-worker", 350, "Locating and resolving concealed seepage and dripping joints.", 1),
  createService("Plumbing & Water", "plumbing-water", "Pump Technician", "pump-technician", 400, "Submersible and centrifugal water pump repairs and servicing.", 1),
  createService("Plumbing & Water", "plumbing-water", "Motor Repair Technician", "motor-repair-technician", 400, "Winding check, capacitor replacement, and water motor repairs.", 1),
  createService("Plumbing & Water", "plumbing-water", "Borewell Helper", "borewell-helper", 250, "Submersible column lowering, casing pipe handling, and borewell assistance.", 2),
  createService("Plumbing & Water", "plumbing-water", "Irrigation Pipe Worker", "irrigation-pipe-worker", 300, "Drip and sprinkler pipe network assembly and repairs.", 1),

  // ==========================================
  // CATEGORY 4 — CLEANING & HOUSEHOLD
  // ==========================================
  createService("Cleaning & Household", "cleaning-household", "Home Cleaner", "home-cleaner", 250, "Standard room sweeping, mopping, cobweb removal, and surface wiping.", 2),
  createService("Cleaning & Household", "cleaning-household", "Bathroom Cleaner", "bathroom-cleaner", 250, "Intensive bathroom descaling, tile scrubbing, and sanitization.", 1),
  createService("Cleaning & Household", "cleaning-household", "Kitchen Cleaner", "kitchen-cleaner", 250, "Degreasing counter tops, chimney exterior, and kitchen cabinets.", 2),
  createService("Cleaning & Household", "cleaning-household", "Floor Cleaner", "floor-cleaner", 250, "Machine and manual floor scrubbing, polishing, and sanitization.", 1),
  createService("Cleaning & Household", "cleaning-household", "Window Cleaner", "window-cleaner", 250, "Glass streak-free cleaning, window sill, and mesh screen washing.", 1),
  createService("Cleaning & Household", "cleaning-household", "Sofa Cleaning Worker", "sofa-cleaning-worker", 300, "Fabric/leather shampooing, vacuuming, and stain extraction.", 1),
  createService("Cleaning & Household", "cleaning-household", "Mattress Cleaning Worker", "mattress-cleaning-worker", 300, "Deep allergen extraction, vacuuming, and sanitization of mattresses.", 1),
  createService("Cleaning & Household", "cleaning-household", "Carpet Cleaning Worker", "carpet-cleaning-worker", 300, "Deep rug and carpet spot cleaning, foam shampoo, and drying.", 1),
  createService("Cleaning & Household", "cleaning-household", "Deep Cleaning Worker", "deep-cleaning-worker", 350, "End-to-end vacant/occupied home thorough deep cleaning.", 3),
  createService("Cleaning & Household", "cleaning-household", "Dusting Worker", "dusting-worker", 250, "Detailed dusting of shelves, books, blinds, and artifacts.", 1),
  createService("Cleaning & Household", "cleaning-household", "Housekeeping Worker", "housekeeping-worker", 250, "Daily bed making, tidying, trash clearing, and organizing.", 2),
  createService("Cleaning & Household", "cleaning-household", "Utensil Cleaning Worker", "utensil-cleaning-worker", 200, "Dishwashing, utensil scrubbing, and kitchen sink cleanup.", 1),
  createService("Cleaning & Household", "cleaning-household", "Home Clothes Washing Specialist", "home-clothes-washing-specialist", 250, "Hand washing and machine laundry care for garments.", 2),
  createService("Cleaning & Household", "cleaning-household", "Home Ironing & Pressing Specialist", "home-ironing-pressing-specialist", 200, "Crisp steam and dry ironing for shirts, pants, and sarees.", 1),
  createService("Cleaning & Household", "cleaning-household", "Clothes Folding Worker", "clothes-folding-worker", 200, "Neat wardrobe organizing and systematic garment folding.", 1),
  createService("Cleaning & Household", "cleaning-household", "Packing/Unpacking Helper", "packing-unpacking-helper", 250, "Assisting in home shifting boxes, bubble wrapping, and unpacking.", 2),
  createService("Cleaning & Household", "cleaning-household", "Daily Housekeeping Helper", "daily-housekeeping-helper", 250, "All-round support for daily domestic household chores.", 2),
  createService("Cleaning & Household", "cleaning-household", "Senior Household Assistant", "senior-household-assistant", 250, "Compassionate support and domestic companionship for elderly family members.", 2),

  // ==========================================
  // CATEGORY 5 — PAINTING & DECORATION
  // ==========================================
  createService("Painting & Decoration", "painting-decoration", "Painter", "painter", 400, "Skilled painter for interior and exterior emulsion and enamel finishes.", 2),
  createService("Painting & Decoration", "painting-decoration", "Painter Helper", "painter-helper", 250, "Sanding walls, masking furniture, paint mixing, and cleaning.", 2),
  createService("Painting & Decoration", "painting-decoration", "Wall Putty Worker", "wall-putty-worker", 350, "Double coat wall putty application and smooth sanding.", 2),
  createService("Painting & Decoration", "painting-decoration", "Interior Painting Worker", "interior-painting-worker", 400, "Ceiling and wall interior paint application with roller finish.", 2),
  createService("Painting & Decoration", "painting-decoration", "Exterior Painting Worker", "exterior-painting-worker", 450, "Weather-proof exterior painting with scaffolding support.", 3),
  createService("Painting & Decoration", "painting-decoration", "Spray Painter", "spray-painter", 450, "Pneumatic spray painting for grills, gates, and smooth furniture.", 2),
  createService("Painting & Decoration", "painting-decoration", "Texture Painter", "texture-painter", 500, "Designer texture patterns, stencil art, and accent wall creation.", 2),
  createService("Painting & Decoration", "painting-decoration", "Wallpaper Installer", "wallpaper-installer", 400, "Pattern matching, adhesive application, and wallpaper pasting.", 2),
  createService("Painting & Decoration", "painting-decoration", "Wallpaper Removal Worker", "wallpaper-removal-worker", 300, "Safe peeling, scraping, and surface prep for old wallpaper.", 1),
  createService("Painting & Decoration", "painting-decoration", "Decorative Painting Worker", "decorative-painting-worker", 450, "Metallic effects, custom stripes, and creative room aesthetics.", 2),
  createService("Painting & Decoration", "painting-decoration", "Wood Painter", "wood-painter", 400, "Wood polish, melamine, PU coating, and varnish for timber doors.", 2),
  createService("Painting & Decoration", "painting-decoration", "Metal Painter", "metal-painter", 350, "Anti-rust primer and enamel coating for window grills and gates.", 2),

  // ==========================================
  // CATEGORY 6 — APPLIANCE SERVICES
  // ==========================================
  createService("Appliance Services", "appliance-services", "Refrigerator Technician", "refrigerator-technician", 400, "Cooling issues, compressor test, gas charging, and thermostat fixes.", 1),
  createService("Appliance Services", "appliance-services", "Washing Machine Technician", "washing-machine-technician", 400, "Spin cycle faults, drum vibration, drainage pump, and PCB repairs.", 1),
  createService("Appliance Services", "appliance-services", "AC Technician", "ac-technician", 450, "AC deep foam jet servicing, gas leakage repair, and PCB diagnostics.", 1),
  createService("Appliance Services", "appliance-services", "AC Helper", "ac-helper", 250, "Assisting in outdoor unit lifting, water bucket handling, and coil cleaning.", 1),
  createService("Appliance Services", "appliance-services", "Cooler Technician", "cooler-technician", 300, "Air cooler pump, motor replacement, and honeycomb pad changing.", 1),
  createService("Appliance Services", "appliance-services", "Microwave Technician", "microwave-technician", 350, "Magnetron replacement, touch panel, and heating diagnostics.", 1),
  createService("Appliance Services", "appliance-services", "Oven Technician", "oven-technician", 350, "OTG heating coil, thermostat, and timer component repair.", 1),
  createService("Appliance Services", "appliance-services", "Geyser Technician", "geyser-technician", 350, "Water heater element descaling, thermostat, and safety valve check.", 1),
  createService("Appliance Services", "appliance-services", "Water Purifier Technician", "water-purifier-technician", 350, "Sediment/carbon filter replacement and pump diagnostics.", 1),
  createService("Appliance Services", "appliance-services", "RO Technician", "ro-technician", 350, "Reverse osmosis membrane replacement, TDS adjustment, and flushing.", 1),
  createService("Appliance Services", "appliance-services", "Mixer/Grinder Repair Worker", "mixer-grinder-repair-worker", 300, "Jar coupler, blade alignment, carbon brush, and motor repair.", 1),
  createService("Appliance Services", "appliance-services", "Small Appliance Technician", "small-appliance-technician", 300, "Electric iron, kettle, toaster, and induction stove repair.", 1),

  // ==========================================
  // CATEGORY 7 — ELECTRONICS & TECHNOLOGY
  // ==========================================
  createService("Electronics & Technology", "electronics-technology", "Computer Technician", "computer-technician", 400, "Hardware diagnostics, RAM/SSD upgrades, and system troubleshooting.", 1),
  createService("Electronics & Technology", "electronics-technology", "Laptop Technician", "laptop-technician", 450, "Screen replacement, hinge repair, battery replacement, and thermal repasting.", 1),
  createService("Electronics & Technology", "electronics-technology", "Desktop Technician", "desktop-technician", 400, "PC assembly, SMPS power supply fix, and motherboard diagnostics.", 1),
  createService("Electronics & Technology", "electronics-technology", "Printer Technician", "printer-technician", 350, "Cartridge refilling, paper jam fix, and network printer sharing.", 1),
  createService("Electronics & Technology", "electronics-technology", "Wi-Fi Setup Technician", "wifi-setup-technician", 350, "Broadband configuration, Wi-Fi channel optimization, and range extension.", 1),
  createService("Electronics & Technology", "electronics-technology", "Router Technician", "router-technician", 350, "Mesh Wi-Fi setup, router firmware update, and security config.", 1),
  createService("Electronics & Technology", "electronics-technology", "Network Technician", "network-technician", 400, "LAN cabling, RJ45 crimping, switch configuration, and IP setup.", 1),
  createService("Electronics & Technology", "electronics-technology", "CCTV Technician", "cctv-technician", 400, "Security camera DVR setup, IP camera configuration, and remote viewing.", 1),
  createService("Electronics & Technology", "electronics-technology", "CCTV Helper", "cctv-helper", 250, "Wire routing, ladder holding, and mounting support for cameras.", 1),
  createService("Electronics & Technology", "electronics-technology", "Mobile Phone Technician", "mobile-phone-technician", 400, "Screen replacement, charging port fix, and software flashing.", 1),
  createService("Electronics & Technology", "electronics-technology", "Smart TV Technician", "smart-tv-technician", 400, "Smart OS setup, soundbar connection, and display troubleshooting.", 1),
  createService("Electronics & Technology", "electronics-technology", "TV Installation Worker", "tv-installation-worker", 300, "Wall mounting, HDMI cabling, and setup of television.", 1),
  createService("Electronics & Technology", "electronics-technology", "Data Backup Technician", "data-backup-technician", 350, "External drive backup, cloud sync, and data recovery assistance.", 1),
  createService("Electronics & Technology", "electronics-technology", "Software Installation Technician", "software-installation-technician", 350, "Operating system installation, antivirus setup, and drivers.", 1),
  createService("Electronics & Technology", "electronics-technology", "Computer Setup Assistant", "computer-setup-assistant", 300, "Unboxing, peripheral wiring, and initial computer personalization.", 1),
  createService("Electronics & Technology", "electronics-technology", "Digital Device Trainer", "digital-device-trainer", 350, "One-on-one training for smartphones, apps, and computer skills.", 1),

  // ==========================================
  // CATEGORY 8 — AGRICULTURE & FARM WORK
  // ==========================================
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Farm Labourer", "farm-labourer", 250, "Manual farm field work, trenching, soil tilling, and crop handling.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Agricultural Helper", "agricultural-helper", 250, "General agricultural assistance for seasonal farming operations.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Field Preparation Worker", "field-preparation-worker", 250, "Land leveling, furrowing, and bund preparation.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Ploughing Helper", "ploughing-helper", 250, "Assisting in tractor and animal-drawn ploughing operations.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Seed Sowing Worker", "seed-sowing-worker", 250, "Systematic row seed sowing and bed planting.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Transplanting Worker", "transplanting-worker", 250, "Paddy and vegetable sapling transplanting.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Weeding Worker", "weeding-worker", 250, "Manual weed removal and crop bed hoeing.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Harvesting Worker", "harvesting-worker", 250, "Crop harvesting, threshing, and stacking produce.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Crop Maintenance Worker", "crop-maintenance-worker", 250, "Pruning, staking, and overall plant health check.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Fertilizer Application Worker", "fertilizer-application-worker", 300, "Precise bio-fertilizer and compost distribution.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Pesticide Spraying Assistant", "pesticide-spraying-assistant", 300, "Protected backpack spraying for pest management.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Farm Irrigation Worker", "farm-irrigation-worker", 250, "Channel water management and drip line operation.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Vegetable Farm Worker", "vegetable-farm-worker", 250, "Vegetable picking, grading, and crate packaging.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Fruit Farm Worker", "fruit-farm-worker", 250, "Fruit harvesting, bagging, and orchard maintenance.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Flower Farm Worker", "flower-farm-worker", 250, "Floriculture harvesting, garland sorting, and stalk cutting.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Nursery Worker", "nursery-worker", 250, "Sapling potting, seedling care, and watering.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Greenhouse Worker", "greenhouse-worker", 300, "Polyhouse climate check, misting, and crop care.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Organic Farming Worker", "organic-farming-worker", 300, "Pest repellent preparation and organic manure composting.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Farm Equipment Helper", "farm-equipment-helper", 250, "Cleaning and maintenance of tillers, pumps, and farm tools.", 2),
  createService("Agriculture & Farm Work", "agriculture-farm-work", "Agricultural Machine Operator", "agricultural-machine-operator", 400, "Skilled operation of power tillers, reapers, and threshers.", 2),

  // ==========================================
  // CATEGORY 9 — GARDENING & LANDSCAPING
  // ==========================================
  createService("Gardening & Landscaping", "gardening-landscaping", "Gardener", "gardener", 300, "Skilled gardening, pot repotting, pruning, and plant care.", 2),
  createService("Gardening & Landscaping", "gardening-landscaping", "Gardening Helper", "gardening-helper", 250, "Weeding, watering, leaf raking, and soil moving.", 1),
  createService("Gardening & Landscaping", "gardening-landscaping", "Lawn Maintenance Worker", "lawn-maintenance-worker", 300, "Lawn mowing, edge trimming, and turf aerating.", 1),
  createService("Gardening & Landscaping", "gardening-landscaping", "Tree Trimming Worker", "tree-trimming-worker", 350, "Branch pruning, dead wood cutting, and tree shaping.", 1),
  createService("Gardening & Landscaping", "gardening-landscaping", "Hedge Cutting Worker", "hedge-cutting-worker", 300, "Ornamental hedge shaping and boundary bush trimming.", 1),
  createService("Gardening & Landscaping", "gardening-landscaping", "Planting Worker", "planting-worker", 250, "Digging plant pits, root ball planting, and initial watering.", 1),
  createService("Gardening & Landscaping", "gardening-landscaping", "Plant Nursery Worker", "plant-nursery-worker", 250, "Seed tray potting and greenhouse plant grooming.", 1),
  createService("Gardening & Landscaping", "gardening-landscaping", "Compost Worker", "compost-worker", 250, "Compost pit turning, mulch spreading, and organic soil feeding.", 1),
  createService("Gardening & Landscaping", "gardening-landscaping", "Terrace Garden Worker", "terrace-garden-worker", 300, "Rooftop planter maintenance, drain mat check, and pot care.", 1),
  createService("Gardening & Landscaping", "gardening-landscaping", "Kitchen Garden Worker", "kitchen-garden-worker", 300, "Setting up organic herb and vegetable patches at home.", 1),
  createService("Gardening & Landscaping", "gardening-landscaping", "Landscaping Worker", "landscaping-worker", 400, "Hardscaping, rock garden styling, and garden stone laying.", 2),
  createService("Gardening & Landscaping", "gardening-landscaping", "Garden Cleaning Worker", "garden-cleaning-worker", 250, "Garden debris clearing, dried branch disposal, and raking.", 1),

  // ==========================================
  // CATEGORY 10 — LIVESTOCK & DAIRY
  // ==========================================
  createService("Livestock & Dairy", "livestock-dairy", "Dairy Farm Worker", "dairy-farm-worker", 300, "Cattle care, dairy maintenance, and feeding management.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Cow Care Worker", "cow-care-worker", 250, "Cow grooming, washing, fodder provision, and health monitoring.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Buffalo Care Worker", "buffalo-care-worker", 250, "Buffalo bathing, feeding, and stall management.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Goat Care Worker", "goat-care-worker", 250, "Goat shed hygiene, grazing support, and feed preparation.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Sheep Care Worker", "sheep-care-worker", 250, "Sheep pen management, feeding, and grooming assistance.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Poultry Farm Worker", "poultry-farm-worker", 250, "Poultry coop management, egg collection, and feeder filling.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Poultry Care Worker", "poultry-care-worker", 250, "Brooder temperature check, chick care, and coop sanitation.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Animal Shed Cleaner", "animal-shed-cleaner", 250, "Dung removal, water hosing, and lime disinfection of barns.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Animal Feeding Worker", "animal-feeding-worker", 250, "Chaff cutting, silage mixing, and systematic animal feeding.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Dairy Milking Assistant", "dairy-milking-assistant", 300, "Hygienic manual and machine cow/buffalo milking.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Livestock Farm Helper", "livestock-farm-helper", 250, "General manpower for livestock farm upkeep and cattle movement.", 2),
  createService("Livestock & Dairy", "livestock-dairy", "Farm Animal Care Assistant", "farm-animal-care-assistant", 250, "Assisting veterinarians and managing animal well-being.", 2),

  // ==========================================
  // CATEGORY 11 — CONSTRUCTION & SKILLED LABOUR
  // ==========================================
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Mason", "mason", 400, "Bricklaying, column construction, and structural cement work.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Mason Helper", "mason-helper", 250, "Cement mixing, brick carrying, and scaffolding help.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Construction Labourer", "construction-labourer", 250, "Heavy on-site material carrying, digging, and rubble handling.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Steel Worker", "steel-worker", 400, "Structural TMT steel cutting, column cage placing, and fabrication.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Welding Worker", "welding-worker", 400, "Arc & gas welding for gates, grills, and structural joints.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Welder Helper", "welder-helper", 250, "Holding metal workpieces, grinding, and wire brushing.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Shuttering Worker", "shuttering-worker", 350, "Plywood and iron plate shuttering for concrete casting.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Bar Bending Worker", "bar-bending-worker", 350, "Rebar cutting, bending stirrups, and binding wire work.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Tile Worker", "tile-worker", 400, "Precision floor and wall tile fixing on construction sites.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Brick Worker", "brick-worker", 350, "Red brick and fly-ash brick wall construction.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Concrete Worker", "concrete-worker", 350, "Concrete pouring, needle vibrating, and slab leveling.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Plaster Worker", "plaster-worker", 350, "Smooth internal and rough external cement plastering.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Excavation Helper", "excavation-helper", 250, "Foundation trench digging and soil disposal.", 2),
  createService("Construction & Skilled Labour", "construction-skilled-labour", "Construction Site Helper", "construction-site-helper", 250, "General site upkeep, water curing, and material organizing.", 2),

  // ==========================================
  // CATEGORY 12 — VEHICLE SERVICES
  // ==========================================
  createService("Vehicle Services", "vehicle-services", "Bike Mechanic", "bike-mechanic", 350, "Doorstep two-wheeler servicing, chain lube, brake adjustment, and oil change.", 1),
  createService("Vehicle Services", "vehicle-services", "Car Mechanic", "car-mechanic", 450, "Engine diagnostics, brake overhaul, coolant change, and tune-up.", 1),
  createService("Vehicle Services", "vehicle-services", "Auto Mechanic", "auto-mechanic", 350, "Three-wheeler auto rickshaw repairs and maintenance.", 1),
  createService("Vehicle Services", "vehicle-services", "Tractor Mechanic", "tractor-mechanic", 400, "Agricultural tractor hydraulic and engine maintenance.", 2),
  createService("Vehicle Services", "vehicle-services", "Bicycle Repair Worker", "bicycle-repair-worker", 250, "Bicycle brake adjustment, gear tuning, and chain lubrication.", 1),
  createService("Vehicle Services", "vehicle-services", "Tyre Repair Worker", "tyre-repair-worker", 250, "Tyre replacement, wheel changing, and air pressure check.", 1),
  createService("Vehicle Services", "vehicle-services", "Puncture Repair Worker", "puncture-repair-worker", 250, "Doorstep tubeless and tube tyre puncture repair.", 1),
  createService("Vehicle Services", "vehicle-services", "Automotive Battery Technician", "automotive-battery-technician", 350, "Vehicle battery jump-start, voltage check, and replacement.", 1),
  createService("Vehicle Services", "vehicle-services", "Vehicle Washing Worker", "vehicle-washing-worker", 250, "Pressure wash, exterior shampooing, and drying for bikes/cars.", 1),
  createService("Vehicle Services", "vehicle-services", "Vehicle Cleaning Worker", "vehicle-cleaning-worker", 250, "Interior vacuuming, dashboard wipe, and glass cleaning.", 1),
  createService("Vehicle Services", "vehicle-services", "Vehicle Detailing Worker", "vehicle-detailing-worker", 350, "Wax rubbing, scratch buffing, and interior deep disinfection.", 2),
  createService("Vehicle Services", "vehicle-services", "Car AC Technician", "car-ac-technician", 450, "Car AC cooling check, gas recharge, and cabin filter change.", 1),
  createService("Vehicle Services", "vehicle-services", "Tractor Maintenance Helper", "tractor-maintenance-helper", 250, "Tractor washing, implement attachment, and mechanic support.", 2),
  createService("Vehicle Services", "vehicle-services", "Garage Helper", "garage-helper", 250, "Tool passing, parts cleaning, and garage assistance.", 1),

  // ==========================================
  // CATEGORY 13 — DRIVING & LOCAL ASSISTANCE
  // ==========================================
  createService("Driving & Local Assistance", "driving-local-assistance", "Personal Driver", "personal-driver", 350, "Professional hourly chauffeur for private cars in city/intercity.", 2),
  createService("Driving & Local Assistance", "driving-local-assistance", "Car Driver", "car-driver", 350, "Experienced manual & automatic car driver on demand.", 2),
  createService("Driving & Local Assistance", "driving-local-assistance", "Delivery Driver", "delivery-driver", 300, "Commercial parcel and goods vehicle driver.", 2),
  createService("Driving & Local Assistance", "driving-local-assistance", "Tractor Driver", "tractor-driver", 350, "Licensed driver for farm tractors and field haulage.", 2),
  createService("Driving & Local Assistance", "driving-local-assistance", "Pickup/Van Driver", "pickup-van-driver", 350, "Commercial pickup van and light commercial vehicle driving.", 2),
  createService("Driving & Local Assistance", "driving-local-assistance", "Loading Vehicle Helper", "loading-vehicle-helper", 250, "Assisting drivers in loading cargo and navigation.", 2),
  createService("Driving & Local Assistance", "driving-local-assistance", "Local Errand Assistant", "local-errand-assistant", 250, "Completing local shopping, bill payments, and courier drops.", 1),
  createService("Driving & Local Assistance", "driving-local-assistance", "Personal Courier & Shopping Driver", "personal-courier-shopping-driver", 250, "Accompanying for grocery, bazaar, and marketplace shopping.", 1),
  createService("Driving & Local Assistance", "driving-local-assistance", "Document Delivery Assistant", "document-delivery-assistant", 250, "Safe and rapid physical document delivery across town.", 1),

  // ==========================================
  // CATEGORY 14 — MOVING & MANPOWER
  // ==========================================
  createService("Moving & Manpower", "moving-manpower", "General Labourer", "general-labourer", 250, "Heavy lifting, shifting items, and physical task support.", 2),
  createService("Moving & Manpower", "moving-manpower", "Loading Worker", "loading-worker", 250, "Systematic truck and vehicle cargo loading.", 2),
  createService("Moving & Manpower", "moving-manpower", "Unloading Worker", "unloading-worker", 250, "Safe unloading and placement of heavy packages.", 2),
  createService("Moving & Manpower", "moving-manpower", "Household Moving Helper", "household-moving-helper", 250, "Home shifting assistance, carrying boxes up stairs.", 2),
  createService("Moving & Manpower", "moving-manpower", "Furniture Moving Worker", "furniture-moving-worker", 300, "Safe handling and maneuvering of wardrobes, beds, and sofas.", 2),
  createService("Moving & Manpower", "moving-manpower", "Packing Worker", "packing-worker", 250, "Corrugated box packing, bubble wrap, and carton sealing.", 2),
  createService("Moving & Manpower", "moving-manpower", "Unpacking Worker", "unpacking-worker", 250, "Opening cartons, placement of items, and debris disposal.", 2),
  createService("Moving & Manpower", "moving-manpower", "Heavy Cargo Warehouse Helper", "heavy-cargo-warehouse-helper", 250, "Pallet arrangement, inventory stacking, and sorting.", 2),
  createService("Moving & Manpower", "moving-manpower", "Commercial Storefront Mover", "commercial-storefront-mover", 250, "Commercial shop inventory moving and customer carrying support.", 2),
  createService("Moving & Manpower", "moving-manpower", "Stage Loading & Event Manpower", "stage-loading-event-manpower", 250, "Stage gear shifting, booth setups, and event logistics.", 2),
  createService("Moving & Manpower", "moving-manpower", "Site Rubble & Block Mover", "site-rubble-block-mover", 250, "Carrying aggregate, cement bags, and steel bars.", 2),
  createService("Moving & Manpower", "moving-manpower", "Material Handling Worker", "material-handling-worker", 300, "Industrial crate and equipment movement with hand trolleys.", 2),

  // ==========================================
  // CATEGORY 15 — HOME TUTORS & EDUCATION
  // ==========================================
  createService("Home Tutors & Education", "home-tutors-education", "Primary School Tutor", "primary-school-tutor", 250, "Class 1-5 all-subject foundational concept tutoring.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Secondary School Tutor", "secondary-school-tutor", 350, "Class 6-10 academic coaching and syllabus completion.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Mathematics Tutor", "mathematics-tutor", 400, "Algebra, Geometry, Trigonometry, and Calculus tutoring.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Science Tutor", "science-tutor", 400, "Physics, Chemistry, and Biology concept coaching.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "English Tutor", "english-tutor", 350, "Grammar, comprehension, and literature coaching.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Odia Tutor", "odia-tutor", 250, "Odia language reading, writing, and school literature coaching.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Hindi Tutor", "hindi-tutor", 250, "Hindi language grammar, speaking, and academic tutoring.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Computer Tutor", "computer-tutor", 350, "Basic programming, IT curriculum, and computer fundamentals.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Spoken English Trainer", "spoken-english-trainer", 400, "Fluency building, pronunciation, and interview communication.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "School Homework Assistant", "school-homework-assistant", 250, "Daily school assignment and project completion mentoring.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Exam Preparation Tutor", "exam-preparation-tutor", 400, "Board exam strategy, mock test series, and question solving.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Drawing Teacher", "drawing-teacher", 300, "Sketching, watercolors, oil pastels, and fine arts training.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Music Teacher", "music-teacher", 350, "Vocal classical, harmonium, keyboard, and tabla lessons.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Dance Teacher", "dance-teacher", 350, "Odissi classical dance, folk, and contemporary choreography.", 1),
  createService("Home Tutors & Education", "home-tutors-education", "Basic Computer Trainer", "basic-computer-trainer", 300, "Internet browsing, email, and MS Office coaching for beginners.", 1),

  // ==========================================
  // CATEGORY 16 — GRAPHICS & DIGITAL FREELANCE
  // ==========================================
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Graphic Designer", "graphic-designer", 400, "Creative design for marketing creatives, digital graphics, and UI assets.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Logo Designer", "logo-designer", 450, "Custom vector brand identity and typography logo creation.", 2),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Poster Designer", "poster-designer", 350, "Print and web event poster layout and styling.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Banner Designer", "banner-designer", 350, "Outdoor flex banner and website promo banner artwork.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Visiting Card Designer", "visiting-card-designer", 300, "Double-sided professional business card layout.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Social Media Designer", "social-media-designer", 350, "Instagram carousels, Facebook flyers, and YouTube thumbnails.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Video Editor", "video-editor", 450, "Timeline editing, transitions, audio mixing, and color grading.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Photo Editor", "photo-editor", 350, "High-end portrait retouching, background removal, and color correction.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Content Writer", "content-writer", 350, "SEO articles, website copywriting, and social media text.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Data Entry Operator", "data-entry-operator", 250, "Accurate numerical and textual data input into databases.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Typist", "typist", 250, "Fast English & Odia typing of legal, academic, and business papers.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Excel Operator", "excel-operator", 300, "Formulas, VLOOKUP, pivot tables, and spreadsheet cleanup.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Word Processing Assistant", "word-processing-assistant", 250, "Document formatting, table of contents, and report layout.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Presentation Designer", "presentation-designer", 350, "PowerPoint / Google Slides deck design and animations.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Resume Designer", "resume-designer", 300, "ATS-friendly modern CV and portfolio design.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Translation Worker", "translation-worker", 350, "Accurate English to Odia and Hindi text translation.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Transcription Worker", "transcription-worker", 300, "Audio recording to text transcription with timestamps.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Digital Marketing Assistant", "digital-marketing-assistant", 350, "Ad campaign setup, audience targeting, and campaign monitoring.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Social Media Assistant", "social-media-assistant", 300, "Scheduling posts, answering comments, and profile management.", 1),
  createService("Graphics & Digital Freelance", "graphics-digital-freelance", "Online Research Assistant", "online-research-assistant", 300, "Web data gathering, competitor research, and lead list compilation.", 1),

  // ==========================================
  // CATEGORY 17 — BUSINESS & SHOP ASSISTANCE
  // ==========================================
  createService("Business & Shop Assistance", "business-shop-assistance", "Shop Assistant", "shop-assistant", 250, "Customer handling, shelf restocking, and store upkeep.", 2),
  createService("Business & Shop Assistance", "business-shop-assistance", "Billing Assistant", "billing-assistant", 300, "POS software operation, barcode scanning, and invoice generation.", 2),
  createService("Business & Shop Assistance", "business-shop-assistance", "Cash Counter Assistant", "cash-counter-assistant", 300, "Cash handling, change calculation, and POS reconciliation.", 2),
  createService("Business & Shop Assistance", "business-shop-assistance", "Inventory Assistant", "inventory-assistant", 300, "Stock entry, barcode tagging, and warehouse audit assistance.", 2),
  createService("Business & Shop Assistance", "business-shop-assistance", "Stock Counting Worker", "stock-counting-worker", 250, "Physical stock verification and discrepancy counting.", 2),
  createService("Business & Shop Assistance", "business-shop-assistance", "Retail Merchandise Packing Associate", "retail-merchandise-packing-associate", 250, "Retail merchandise wrapping and customer bag packing.", 2),
  createService("Business & Shop Assistance", "business-shop-assistance", "Warehouse Assistant", "warehouse-assistant", 250, "Order picking, carton sorting, and inventory stacking.", 2),
  createService("Business & Shop Assistance", "business-shop-assistance", "Sales Assistant", "sales-assistant", 300, "Retail counter sales and customer product demonstrations.", 2),
  createService("Business & Shop Assistance", "business-shop-assistance", "Field Sales Assistant", "field-sales-assistant", 300, "Field marketing, flyer distribution, and shop-to-shop visits.", 2),
  createService("Business & Shop Assistance", "business-shop-assistance", "Data Entry Assistant", "data-entry-assistant", 250, "Invoice filing and digital ledger data entry.", 1),
  createService("Business & Shop Assistance", "business-shop-assistance", "Computer Operator", "computer-operator", 300, "General office computer operations and printing.", 1),
  createService("Business & Shop Assistance", "business-shop-assistance", "Office Assistant", "office-assistant", 250, "Office errand handling, file organization, and guest hospitality.", 2),
  createService("Business & Shop Assistance", "business-shop-assistance", "Documentation Assistant", "documentation-assistant", 300, "Physical and digital record keeping and file categorization.", 1),

  // ==========================================
  // CATEGORY 18 — EVENT SERVICES
  // ==========================================
  createService("Event Services", "event-services", "Event Venue Logistics Helper", "event-venue-logistics-helper", 250, "General manpower for event logistics, moving chairs, and booth setup.", 2),
  createService("Event Services", "event-services", "Event Setup Worker", "event-setup-worker", 300, "Canopy pitching, carpet laying, and banner hanging.", 2),
  createService("Event Services", "event-services", "Floral & Stage Decor Helper", "floral-stage-decor-helper", 250, "Balloon inflating, flower stringing, and backdrop placement.", 2),
  createService("Event Services", "event-services", "Stage Setup Worker", "stage-setup-worker", 350, "Stage riser assembly, truss fixing, and podium alignment.", 2),
  createService("Event Services", "event-services", "Chair/Table Setup Worker", "chair-table-setup-worker", 250, "Systematic banquet chair alignment and table linen dressing.", 2),
  createService("Event Services", "event-services", "Catering Helper", "catering-helper", 250, "Buffet food refilling, chafing dish lighting, and ice handling.", 2),
  createService("Event Services", "event-services", "Serving Assistant", "serving-assistant", 250, "Polite food and beverage serving to guests at banquets.", 2),
  createService("Event Services", "event-services", "Catering Kitchen Assistant", "catering-kitchen-assistant", 250, "Vegetable chopping, large pot washing, and event kitchen assistance.", 2),
  createService("Event Services", "event-services", "Wedding Helper", "wedding-helper", 300, "All-round errand and logistical coordination during wedding ceremonies.", 2),
  createService("Event Services", "event-services", "Photography Assistant", "photography-assistant", 350, "Holding light reflectors, softbox positioning, and lens management.", 2),
  createService("Event Services", "event-services", "Videography Assistant", "videography-assistant", 350, "Gimbal assistance, battery management, and camera tripod setup.", 2),
  createService("Event Services", "event-services", "Sound System Helper", "sound-system-helper", 300, "Microphone cable routing, speaker placement, and audio tests.", 2),
  createService("Event Services", "event-services", "Event Cleaning Worker", "event-cleaning-worker", 250, "Post-event waste clearing, disposable collection, and hall sweeping.", 2),

  // ==========================================
  // CATEGORY 19 — PERSONAL & FAMILY ASSISTANCE
  // ==========================================
  createService("Personal & Family Assistance", "personal-family-assistance", "Personal Assistant", "personal-assistant", 350, "Schedule coordination, appointment booking, and personal task management.", 2),
  createService("Personal & Family Assistance", "personal-family-assistance", "Household Assistant", "household-assistant", 250, "Assistance with domestic errands, organizing, and daily house tasks.", 2),
  createService("Personal & Family Assistance", "personal-family-assistance", "Family Grocery Shopping Assistant", "family-grocery-shopping-assistant", 250, "Personal grocery and market shopping assistance.", 1),
  createService("Personal & Family Assistance", "personal-family-assistance", "Errand Assistant", "errand-assistant", 250, "Medicine pickup, courier drops, and billing errands.", 1),
  createService("Personal & Family Assistance", "personal-family-assistance", "General Companion/Assistance", "general-companion-assistance", 250, "Friendly accompaniment for walking, doctor visits, and daily activities.", 2),
  createService("Personal & Family Assistance", "personal-family-assistance", "Home Organization Assistant", "home-organization-assistant", 250, "Closet decluttering, pantry organizing, and space optimization.", 2),
  createService("Personal & Family Assistance", "personal-family-assistance", "Household Luggage Packing Assistant", "household-luggage-packing-assistant", 250, "Travel suitcase packing and household item wrapping.", 1),
  createService("Personal & Family Assistance", "personal-family-assistance", "Moving Assistant", "moving-assistant", 250, "Guiding and helping in shifting personal belongings safely.", 2),
  createService("Personal & Family Assistance", "personal-family-assistance", "Cooking Assistant", "cooking-assistant", 300, "Assisting head cook with spices, dough kneading, and prep.", 2),
  createService("Personal & Family Assistance", "personal-family-assistance", "Home Kitchen Cooking Helper", "home-kitchen-cooking-helper", 250, "Vegetable cleaning, peeling, grinding, and kitchen counter tidying.", 1),
  createService("Personal & Family Assistance", "personal-family-assistance", "Meal Preparation Assistant", "meal-preparation-assistant", 300, "Wholesome meal cooking and regional Odia culinary assistance.", 2),

  // ==========================================
  // CATEGORY 20 — BEAUTY & PERSONAL SERVICES
  // ==========================================
  createService("Beauty & Personal Services", "beauty-personal-services", "Beautician", "beautician", 450, "Doorstep facial, waxing, threading, and skincare treatments.", 1),
  createService("Beauty & Personal Services", "beauty-personal-services", "Hairdresser", "hairdresser", 400, "Hair trimming, styling, hair spa, and blow drying at home.", 1),
  createService("Beauty & Personal Services", "beauty-personal-services", "Makeup Artist", "makeup-artist", 500, "Party makeup, engagement, and bridal cosmetics artistry.", 2),
  createService("Beauty & Personal Services", "beauty-personal-services", "Mehndi Artist", "mehndi-artist", 400, "Traditional Arabic, Rajasthani, and bridal henna designs.", 2),
  createService("Beauty & Personal Services", "beauty-personal-services", "Hair Stylist", "hair-stylist", 450, "Professional hair styling, straightening, and curling for events.", 1),
  createService("Beauty & Personal Services", "beauty-personal-services", "Nail Technician", "nail-technician", 350, "Manicure, pedicure, nail polish, and nail care.", 1),
  createService("Beauty & Personal Services", "beauty-personal-services", "Grooming Assistant", "grooming-assistant", 300, "Men and women hygienic grooming and personal care.", 1),
  createService("Beauty & Personal Services", "beauty-personal-services", "Saree Draping Assistant", "saree-draping-assistant", 300, "Flawless traditional and modern pleated saree draping.", 1),
  createService("Beauty & Personal Services", "beauty-personal-services", "Beauty Assistant", "beauty-assistant", 250, "Support during beauty sessions, tool sanitization, and prep.", 1),

  // ==========================================
  // CATEGORY 21 — TAILORING & CLOTHING
  // ==========================================
  createService("Tailoring & Clothing", "tailoring-clothing", "Tailor", "tailor", 350, "Doorstep measurement taking and custom garment cutting.", 1),
  createService("Tailoring & Clothing", "tailoring-clothing", "Sewing Machine Operator", "sewing-machine-operator", 300, "Precision sewing of fabrics, hems, and seams.", 1),
  createService("Tailoring & Clothing", "tailoring-clothing", "Stitching Worker", "stitching-worker", 300, "Stitching curtains, cushion covers, blouses, and dresses.", 1),
  createService("Tailoring & Clothing", "tailoring-clothing", "Clothing Repair Worker", "clothing-repair-worker", 250, "Darning torn garments, zip replacement, and button stitching.", 1),
  createService("Tailoring & Clothing", "tailoring-clothing", "Alteration Worker", "alteration-worker", 300, "Pants waist tapering, hem shortening, and blouse resizing.", 1),
  createService("Tailoring & Clothing", "tailoring-clothing", "Embroidery Worker", "embroidery-worker", 350, "Machine embroidery work and border designs.", 1),
  createService("Tailoring & Clothing", "tailoring-clothing", "Hand Embroidery Worker", "hand-embroidery-worker", 350, "Intricate Kantha, Zardozi, and handmade thread embroidery.", 2),
  createService("Tailoring & Clothing", "tailoring-clothing", "Fashion Design Assistant", "fashion-design-assistant", 400, "Pattern drafting, fabric selection, and boutique styling advice.", 1),
  createService("Tailoring & Clothing", "tailoring-clothing", "Garment Finishing Worker", "garment-finishing-worker", 250, "Thread clipping, label attachment, and garment pressing.", 1),
  createService("Tailoring & Clothing", "tailoring-clothing", "Garment Steam Ironing Specialist", "garment-steam-ironing-specialist", 200, "Heavy-duty crease-free pressing for traditional and formal wear.", 1),

  // ==========================================
  // CATEGORY 22 — HANDICRAFT & HOME-BASED SKILLS
  // ==========================================
  createService("Handicraft & Home-Based Skills", "handicraft-home-based-skills", "Handicraft Worker", "handicraft-worker", 300, "Handmade craft creation, filigree assembly, and folk crafts.", 2),
  createService("Handicraft & Home-Based Skills", "handicraft-home-based-skills", "Bamboo Craft Worker", "bamboo-craft-worker", 300, "Bamboo weaving, basket making, and bamboo home decor items.", 2),
  createService("Handicraft & Home-Based Skills", "handicraft-home-based-skills", "Cane Craft Worker", "cane-craft-worker", 300, "Cane chair re-weaving, cane artifacts, and repair.", 2),
  createService("Handicraft & Home-Based Skills", "handicraft-home-based-skills", "Pottery Worker", "pottery-worker", 300, "Clay molding, terracotta modeling, and earthenware crafting.", 2),
  createService("Handicraft & Home-Based Skills", "handicraft-home-based-skills", "Decorative Craft Worker", "decorative-craft-worker", 300, "Wall hangings, Toran making, and festival craft art.", 2),
  createService("Handicraft & Home-Based Skills", "handicraft-home-based-skills", "Gift Packing Worker", "gift-packing-worker", 250, "Trousseau packing, festive hampers, and luxury gift wrapping.", 1),
  createService("Handicraft & Home-Based Skills", "handicraft-home-based-skills", "Handmade Product Worker", "handmade-product-worker", 250, "Artisan soap, incense stick packaging, and craft production.", 2),
  createService("Handicraft & Home-Based Skills", "handicraft-home-based-skills", "Candle Making Worker", "candle-making-worker", 250, "Scented wax pouring, wick placement, and decorative candle craft.", 1),
  createService("Handicraft & Home-Based Skills", "handicraft-home-based-skills", "Decorative Item Maker", "decorative-item-maker", 300, "Custom paper lanterns, Rangoli stencils, and showpieces.", 1),
  createService("Handicraft & Home-Based Skills", "handicraft-home-based-skills", "Artisan Assistant", "artisan-assistant", 250, "Material prep, stone grinding, and workshop assistance for master artists.", 2),

  // ==========================================
  // CATEGORY 23 — LAUNDRY & GARMENT CARE
  // ==========================================
  createService("Laundry & Garment Care", "laundry-garment-care", "Commercial Laundry Worker", "commercial-laundry-worker", 250, "Washing, stain pre-treatment, and rinsing of clothes.", 2),
  createService("Laundry & Garment Care", "laundry-garment-care", "Clothes Washing Assistant", "clothes-washing-assistant", 250, "Manual bucket washing and delicate garment care.", 1),
  createService("Laundry & Garment Care", "laundry-garment-care", "Professional Laundry Presser", "professional-laundry-presser", 200, "Doorstep crisp pressing of daily wear and linens.", 1),
  createService("Laundry & Garment Care", "laundry-garment-care", "Drying/Folding Worker", "drying-folding-worker", 200, "Sun drying clothes, hanger arrangement, and neat folding.", 1),
  createService("Laundry & Garment Care", "laundry-garment-care", "Garment Sorting Worker", "garment-sorting-worker", 200, "Sorting whites, colors, woolens, and delicate garments.", 1),
  createService("Laundry & Garment Care", "laundry-garment-care", "Garment Packing Worker", "garment-packing-worker", 200, "Poly-bag sealing and garment wardrobe arrangement.", 1),
  createService("Laundry & Garment Care", "laundry-garment-care", "Shoe Cleaning Worker", "shoe-cleaning-worker", 250, "Sneaker washing, leather shoe polishing, and deodorizing.", 1),
  createService("Laundry & Garment Care", "laundry-garment-care", "Bag Cleaning Worker", "bag-cleaning-worker", 250, "Backpack scrubbing, handbag leather conditioning, and cleaning.", 1),

  // ==========================================
  // CATEGORY 24 — WASTE & RECYCLING
  // ==========================================
  createService("Waste & Recycling", "waste-recycling", "Waste Collection Worker", "waste-collection-worker", 250, "Safe household and residential waste pickup.", 1),
  createService("Waste & Recycling", "waste-recycling", "Dry Waste Collector", "dry-waste-collector", 250, "Paper, cardboard, plastic, and metal waste collection.", 1),
  createService("Waste & Recycling", "waste-recycling", "Recycling Collection Worker", "recycling-collection-worker", 250, "Aggregating recyclable glass bottles and plastics.", 1),
  createService("Waste & Recycling", "waste-recycling", "Scrap Sorting Worker", "scrap-sorting-worker", 250, "Sorting old metal scrap, appliances, and iron rods.", 1),
  createService("Waste & Recycling", "waste-recycling", "Scrap Collection Assistant", "scrap-collection-assistant", 250, "Weighing and lifting heavy domestic scrap.", 1),
  createService("Waste & Recycling", "waste-recycling", "Garden Waste Worker", "garden-waste-worker", 250, "Gathering trimmed branches, dead leaves, and garden cuttings.", 1),
  createService("Waste & Recycling", "waste-recycling", "Waste Segregation Worker", "waste-segregation-worker", 250, "Separating wet organic waste from dry recyclable materials.", 1),
  createService("Waste & Recycling", "waste-recycling", "Recycling Helper", "recycling-helper", 250, "Baling cardboard and loading recycling transport vehicles.", 1),

  // ==========================================
  // CATEGORY 25 — RURAL & VILLAGE SERVICES
  // ==========================================
  createService("Rural & Village Services", "rural-village-services", "Village General Helper", "village-general-helper", 250, "Community and village level daily physical work assistance.", 2),
  createService("Rural & Village Services", "rural-village-services", "Village Agricultural Day Labourer", "village-agricultural-day-labourer", 250, "Field boundary maintenance, bund clearing, and farm tasks.", 2),
  createService("Rural & Village Services", "rural-village-services", "Agricultural Labourer", "agricultural-labourer", 250, "Manual farming labour for paddy, pulses, and vegetables.", 2),
  createService("Rural & Village Services", "rural-village-services", "Livestock Helper", "livestock-helper", 250, "Village cattle grazing and animal shelter upkeep.", 2),
  createService("Rural & Village Services", "rural-village-services", "Poultry Helper", "poultry-helper", 250, "Desi chicken coop maintenance and grain feeding.", 2),
  createService("Rural & Village Services", "rural-village-services", "Dairy Helper", "dairy-helper", 250, "Village dairy farm support and milk container handling.", 2),
  createService("Rural & Village Services", "rural-village-services", "Irrigation Helper", "irrigation-helper", 250, "Canal water diversion and bund breach repair.", 2),
  createService("Rural & Village Services", "rural-village-services", "Pond Cleaning Helper", "pond-cleaning-helper", 250, "Clearing water hyacinth, weeds, and pond debris.", 2),
  createService("Rural & Village Services", "rural-village-services", "Fish Farm Helper", "fish-farm-helper", 250, "Pond fish feeding, net pulling, and fingerling transport.", 2),
  createService("Rural & Village Services", "rural-village-services", "Sapling & Plant Nursery Attendant", "sapling-plant-nursery-attendant", 250, "Forest and fruit tree sapling rearing in village nurseries.", 2),
  createService("Rural & Village Services", "rural-village-services", "Village Construction Helper", "village-construction-helper", 250, "Mud plastering, thatched roof repair, and brick handling.", 2),
  createService("Rural & Village Services", "rural-village-services", "Tractor Field Operations Helper", "tractor-field-operations-helper", 250, "Tractor trolley loading and rural road transport assistance.", 2),
  createService("Rural & Village Services", "rural-village-services", "Village Crop Harvest Labourer", "village-crop-harvest-labourer", 250, "Seasonal paddy cutting and harvest bundling in villages.", 2),
  createService("Rural & Village Services", "rural-village-services", "Field Weeding & De-rooting Labourer", "field-weeding-de-rooting-labourer", 250, "Removing invasive weeds from agricultural plots.", 2),
  createService("Rural & Village Services", "rural-village-services", "Fencing Worker", "fencing-worker", 300, "Bamboo pole, barbed wire, and chain link rural perimeter fencing.", 2),
  createService("Rural & Village Services", "rural-village-services", "Rural Transport Helper", "rural-transport-helper", 250, "Bullock cart, auto, and pickup loading in rural hubs.", 2),
  createService("Rural & Village Services", "rural-village-services", "Market Loading Worker", "market-loading-worker", 250, "Loading vegetable sacks at rural weekly Haat markets.", 2),
  createService("Rural & Village Services", "rural-village-services", "Local Delivery Worker", "local-delivery-worker", 250, "Door-to-door delivery of goods in village clusters.", 1),

  // ==========================================
  // CATEGORY 26 — FISHING & AQUACULTURE
  // ==========================================
  createService("Fishing & Aquaculture", "fishing-aquaculture", "Fish Farm Worker", "fish-farm-worker", 300, "Aquaculture tank monitoring, aeration, and salinity testing.", 2),
  createService("Fishing & Aquaculture", "fishing-aquaculture", "Fish Pond Worker", "fish-pond-worker", 250, "Pond liming, organic feeding, and water level management.", 2),
  createService("Fishing & Aquaculture", "fishing-aquaculture", "Fish Feeding Worker", "fish-feeding-worker", 250, "Scheduled distribution of floating pelleted fish feed.", 1),
  createService("Fishing & Aquaculture", "fishing-aquaculture", "Pond Maintenance Worker", "pond-maintenance-worker", 300, "Pond dyke strengthening, sluice gate maintenance, and netting.", 2),
  createService("Fishing & Aquaculture", "fishing-aquaculture", "Net Handling Worker", "net-handling-worker", 300, "Cast net, drag net hauling, and net mending.", 2),
  createService("Fishing & Aquaculture", "fishing-aquaculture", "Aquaculture Helper", "aquaculture-helper", 250, "Assisting in biofloc tank maintenance and pump operation.", 2),
  createService("Fishing & Aquaculture", "fishing-aquaculture", "Fish Sorting Worker", "fish-sorting-worker", 250, "Weight and species size grading of harvested fish.", 1),
  createService("Fishing & Aquaculture", "fishing-aquaculture", "Fish Packing Worker", "fish-packing-worker", 250, "Ice crushing, thermocol crate packing, and fish preservation.", 1),

  // ==========================================
  // CATEGORY 27 — SECURITY & PROPERTY ASSISTANCE
  // ==========================================
  createService("Security & Property Assistance", "security-property-assistance", "Property Watchman", "property-watchman", 250, "Hourly property vigilance, gatekeeping, and premise watch.", 4),
  createService("Security & Property Assistance", "security-property-assistance", "Event Security Assistant", "event-security-assistant", 300, "Crowd management, queue regulation, and event entrance check.", 2),
  createService("Security & Property Assistance", "security-property-assistance", "Parking Assistant", "parking-assistant", 250, "Vehicle parking guidance, token issue, and driveway clearing.", 2),
  createService("Security & Property Assistance", "security-property-assistance", "Gate Assistant", "gate-assistant", 250, "Visitor log entry, barrier gate opening, and delivery reception.", 2),
  createService("Security & Property Assistance", "security-property-assistance", "Property Inspection Assistant", "property-inspection-assistant", 350, "Vacant plot/home inspection with photo checklist verification.", 1),
  createService("Security & Property Assistance", "security-property-assistance", "Site Watch Assistant", "site-watch-assistant", 250, "Guarding building material and equipment at ongoing sites.", 4),

  // ==========================================
  // CATEGORY 28 — RELIGIOUS & COMMUNITY ASSISTANCE
  // ==========================================
  createService("Religious & Community Assistance", "religious-community-assistance", "Puja Preparation Helper", "puja-preparation-helper", 250, "Cleaning brass lamps, arranging flowers, fruits, and Puja thali.", 2),
  createService("Religious & Community Assistance", "religious-community-assistance", "Temple Event Helper", "temple-event-helper", 250, "Assisting in temple festivities, line discipline, and offerings.", 2),
  createService("Religious & Community Assistance", "religious-community-assistance", "Religious Event Helper", "religious-event-helper", 250, "Satsang, Yajna, and community prayer logistical support.", 2),
  createService("Religious & Community Assistance", "religious-community-assistance", "Community Event Helper", "community-event-helper", 250, "Neighborhood society gathering and festival coordination.", 2),
  createService("Religious & Community Assistance", "religious-community-assistance", "Puja Mandap & Temple Decor Helper", "puja-mandap-temple-decor-helper", 250, "Marigold flower garlands, Mango leaves Toran, and festive lighting.", 2),
  createService("Religious & Community Assistance", "religious-community-assistance", "Temple & Community Hall Cleaner", "temple-community-hall-cleaner", 250, "Washing prayer halls, sanitizing dining floor, and courtyard cleanup.", 2),
  createService("Religious & Community Assistance", "religious-community-assistance", "Seating Arrangement Worker", "seating-arrangement-worker", 250, "Laying out Dari mats, cushions, and plastic chairs for devotees.", 1),
  createService("Religious & Community Assistance", "religious-community-assistance", "Food Distribution Helper", "food-distribution-helper", 250, "Prasad distribution, serving Mahaprasad, and leaf plate cleanup.", 2),

  // ==========================================
  // CATEGORY 29 — EMERGENCY & GENERAL ASSISTANCE
  // ==========================================
  createService("Emergency & General Assistance", "emergency-general-assistance", "Emergency General Helper", "emergency-general-helper", 300, "Rapid dispatch helper for unexpected urgent household or shop needs.", 1),
  createService("Emergency & General Assistance", "emergency-general-assistance", "Emergency Cleaning Worker", "emergency-cleaning-worker", 300, "Post-accident, urgent water leakage, or spill sanitization.", 1),
  createService("Emergency & General Assistance", "emergency-general-assistance", "Emergency Loading Worker", "emergency-loading-worker", 300, "Urgent nighttime or short-notice cargo shifting.", 2),
  createService("Emergency & General Assistance", "emergency-general-assistance", "Emergency Moving Helper", "emergency-moving-helper", 300, "Rapid residential shifting support in emergency circumstances.", 2),
  createService("Emergency & General Assistance", "emergency-general-assistance", "Storm Cleanup Worker", "storm-cleanup-worker", 350, "Clearing debris, roof tin relocation, and post-cyclone cleanup.", 2),
  createService("Emergency & General Assistance", "emergency-general-assistance", "Flood Cleanup Helper", "flood-cleanup-helper", 350, "Pumping mud, clearing silt, and sanitizing flooded floors.", 2),
  createService("Emergency & General Assistance", "emergency-general-assistance", "Fallen Tree Cleanup Helper", "fallen-tree-cleanup-helper", 350, "Assisting in sawing branches, clearing driveway, and hauling wood.", 2),
  createService("Emergency & General Assistance", "emergency-general-assistance", "Temporary Site Helper", "temporary-site-helper", 300, "Short-notice physical assistance for urgent site repairs.", 2),

  // ==========================================
  // CATEGORY 30 — GENERAL HOURLY WORK
  // ==========================================
  createService("General Hourly Work", "general-hourly-work", "General Helper", "general-helper", 250, "Versatile on-demand assistant for any non-specialized task.", 1),
  createService("General Hourly Work", "general-hourly-work", "General Household Labourer", "general-household-labourer", 250, "General home upkeep, grocery lifting, and daily chore support.", 1),
  createService("General Hourly Work", "general-hourly-work", "Retail Shop Counter Helper", "retail-shop-counter-helper", 250, "Store merchandise stocking, dusting, and customer service help.", 2),
  createService("General Hourly Work", "general-hourly-work", "Seasonal Farm Hand Helper", "seasonal-farm-hand-helper", 250, "General agricultural manpower for rural and peri-urban tasks.", 2),
  createService("General Hourly Work", "general-hourly-work", "Loading Helper", "loading-helper", 250, "Manual cargo loading into commercial vehicles.", 2),
  createService("General Hourly Work", "general-hourly-work", "Unloading Helper", "unloading-helper", 250, "Manual cargo unloading and destination stacking.", 2),
  createService("General Hourly Work", "general-hourly-work", "Packing Helper", "packing-helper", 250, "Wrapping and boxing parcels, gifts, and household goods.", 1),
  createService("General Hourly Work", "general-hourly-work", "Premises Sweeping & Sanitizing Helper", "premises-sweeper-sanitizing-helper", 250, "General floor and premise cleaning helper.", 1),
  createService("General Hourly Work", "general-hourly-work", "Social Function Support Helper", "social-function-support-helper", 250, "On-demand support during social and commercial events.", 2),
  createService("General Hourly Work", "general-hourly-work", "Civil Site Material Shifter", "civil-site-material-shifter", 250, "General assistance on civil construction and renovation sites.", 2),
  createService("General Hourly Work", "general-hourly-work", "Furniture & Luggage Shifter", "furniture-luggage-shifter", 250, "Helping move furniture, luggage, and household boxes.", 2),
  createService("General Hourly Work", "general-hourly-work", "Delivery Helper", "delivery-helper", 250, "Accompanying delivery person for multi-drop routes.", 2),
  createService("General Hourly Work", "general-hourly-work", "Pallet & Carton Warehouse Labourer", "pallet-carton-warehouse-labourer", 250, "Carton shifting, labelling, and pallet organization.", 2),
  createService("General Hourly Work", "general-hourly-work", "Market Helper", "market-helper", 250, "Assisting wholesale vegetable and grocery traders in mandis.", 2),
  createService("General Hourly Work", "general-hourly-work", "Office Helper", "office-helper", 250, "Office pantry, filing, photocopying, and reception assistance.", 2),

  // ==========================================
  // CATEGORY 1 — BABY
  // ==========================================
  // Baby & Child Care (1-35)
  createBabyService("Babysitter / Child Caregiver", "babysitter-child-caregiver", 312.50, "Hourly supervision, playtime companionship, and everyday child care assistance at home.", 2),
  createBabyService("Infant Caregiver", "infant-caregiver", 375.00, "Gentle, attentive hourly care and comforting assistance for infants and babies under 1 year.", 2),
  createBabyService("Newborn Care Assistant", "newborn-care-assistant", 437.50, "Specialized non-medical newborn support, swaddling, burping, and mother assistance.", 2),
  createBabyService("Toddler Caregiver", "toddler-caregiver", 312.50, "Active, watchful hourly care, interactive play, and safe home supervision for toddlers.", 2),
  createBabyService("Preschool Child Caregiver", "preschool-child-caregiver", 312.50, "Nurturing care, learning games, and basic routine guidance for preschool-age children.", 2),
  createBabyService("After-School Child Caregiver", "after-school-child-caregiver", 312.50, "Reliable afternoon supervision, snack serving, and safe home companion after school.", 2),
  createBabyService("Child Supervision Assistant", "child-supervision-assistant", 312.50, "Dedicated home safety supervision, engagement, and watchful presence while parents are busy.", 2),
  createBabyService("Baby Feeding Assistant", "baby-feeding-assistant", 375.00, "Bottle preparation, paced feeding, burping, and clean-up assistance for babies.", 2),
  createBabyService("Child Feeding Assistant", "child-feeding-assistant", 312.50, "Patient mealtime support, encouraging nutritious eating, and meal cleanup for young children.", 1),
  createBabyService("Baby Bathing Assistant", "baby-bathing-assistant", 375.00, "Gentle lukewarm bathing, towel drying, moisturizing, and delicate skin care support.", 1),
  createBabyService("Baby Dressing Assistant", "baby-dressing-assistant", 312.50, "Assistance with comfortable dressing, seasonal clothes changing, and grooming for infants.", 1),
  createBabyService("Diaper Changing Assistant", "diaper-changing-assistant", 375.00, "Hygienic diaper changing, barrier cream application, and sanitized diaper disposal.", 1),
  createBabyService("Baby Sleep/Bedtime Assistant", "baby-sleep-bedtime-assistant", 375.00, "Soothing bedtime routines, rocking, lullabies, and safe sleep environment supervision.", 2),
  createBabyService("Child Play Companion", "child-play-companion", 312.50, "Engaging indoor and outdoor developmental games, building blocks, and playful bonding.", 2),
  createBabyService("Indoor Activity Assistant", "indoor-activity-assistant", 312.50, "Creative board games, puzzles, screen-free engagement, and interactive indoor play.", 2),
  createBabyService("Outdoor Activity Companion", "outdoor-activity-companion", 312.50, "Supervised outdoor play in park or yard, cycling safety, and energetic physical games.", 2),
  createBabyService("Child Homework Assistant", "child-homework-assistant", 312.50, "Help with daily school homework assignments, reading practice, and writing guidance.", 1),
  createBabyService("Child Study Companion", "child-study-companion", 312.50, "Focused study support, textbook revision, and maintaining good study habits at home.", 2),
  createBabyService("Storytelling & Reading Assistant", "storytelling-reading-assistant", 312.50, "Expressive story reading in English, Odia, or Hindi, fostering imagination and vocabulary.", 1),
  createBabyService("Drawing & Craft Activity Assistant", "drawing-craft-activity-assistant", 312.50, "Coloring, sketching, paper craft, origami, and creative art sessions for children.", 2),
  createBabyService("School Preparation Assistant", "school-preparation-assistant", 312.50, "Morning school bag packing, uniform assistance, shoes, and cheerful morning routine help.", 1),
  createBabyService("School Pickup/Drop Assistant", "school-pickup-drop-assistant", 375.00, "Safe doorstep walking or transit companion to and from school bus stops or nearby schools.", 1),
  createBabyService("Child Meal Preparation Assistant", "child-meal-preparation-assistant", 312.50, "Preparing kid-friendly healthy meals, snacks, fruit bowls, and gentle kitchen hygiene.", 2),
  createBabyService("Baby Food Preparation Assistant", "baby-food-preparation-assistant", 375.00, "Sterilizing utensils, preparing purees, porridge, khichdi, and fresh wholesome baby food.", 2),
  createBabyService("Child Clothing/Laundry Assistant", "child-clothing-laundry-assistant", 250.00, "Gentle washing, baby-safe detergent rinse, drying, ironing, and neatly folding children's clothes.", 2),
  createBabyService("Baby Room Organization Assistant", "baby-room-organization-assistant", 250.00, "Sanitizing toys, organizing nursery cribs, wardrobe sorting, and neat playroom upkeep.", 2),
  createBabyService("Day Care Helper", "day-care-helper", 312.50, "Full daytime child care assistance, routine monitoring, feeding, and afternoon naps.", 3),
  createBabyService("Day Care Attendant", "day-care-attendant", 312.50, "Hourly home attendant for ongoing child vigilance, light snack preparation, and care.", 3),
  createBabyService("Evening Babysitter", "evening-babysitter", 343.75, "Evening babysitting, dinner companionship, calming play, and bedtime supervision.", 2),
  createBabyService("Night Child Care Assistant", "night-child-care-assistant", 437.50, "Overnight alert child supervision, night feeding assistance, and peaceful sleep support.", 4),
  createBabyService("Emergency Child Care Assistant", "emergency-child-care-assistant", 500.00, "Rapid on-demand dispatch for urgent, short-notice child care and immediate family support.", 2),
  createBabyService("Multiple-Child Caregiver", "multiple-child-caregiver", 437.50, "Experienced supervision and simultaneous care for two or more siblings at home.", 2),
  createBabyService("Twin Baby Care Assistant", "twin-baby-care-assistant", 500.00, "Dedicated support for twins, coordinated feeding schedules, diapering, and soothing.", 3),
  createBabyService("Child Event Caregiver", "child-event-caregiver", 375.00, "Supervising and keeping kids entertained and safe during family functions, weddings, or parties.", 3),
  createBabyService("Child Travel Companion", "child-travel-companion", 437.50, "Accompanying family trips, airport or railway station child assistance, and travel safety.", 3),

  // ==========================================
  // CATEGORY 2 — ELDERLY CARE
  // ==========================================
  // Elderly / Senior Citizen Care (36-70)
  createElderlyService("Elderly Care Assistant", "elderly-care-assistant", 375.00, "Comprehensive non-medical senior care, daily routine support, and caring home assistance.", 2),
  createElderlyService("Senior Citizen Companion", "senior-citizen-companion", 312.50, "Warm companionship, reading the newspaper, pleasant conversations, and emotional wellness.", 2),
  createElderlyService("Elderly Home Assistance", "elderly-home-assistance", 312.50, "Day-to-day domestic support, fetch-and-carry assistance, and helping seniors navigate the home.", 2),
  createElderlyService("Elderly Meal Assistance", "elderly-meal-assistance", 312.50, "Serving warm meals, cutting food, ensuring proper hydration, and comfortable dining support.", 1),
  createElderlyService("Elderly Feeding Assistant", "elderly-feeding-assistant", 375.00, "Patient, dignified spoon-feeding assistance and beverage intake support for seniors.", 1),
  createElderlyService("Elderly Walking Companion", "elderly-walking-companion", 312.50, "Assisted morning and evening walks in neighborhood parks or verandas with steady arm support.", 1),
  createElderlyService("Elderly Mobility Assistant", "elderly-mobility-assistant", 375.00, "Assisting with walking stick, walker, wheelchair navigation, and steady balance support.", 2),
  createElderlyService("Elderly Bathing Assistance", "elderly-bathing-assistance", 437.50, "Safe, slip-free sponge or bathroom bathing assistance with dignity and warm water care.", 1),
  createElderlyService("Elderly Dressing Assistance", "elderly-dressing-assistance", 375.00, "Helping seniors button clothes, wear comfortable slippers, socks, and daily garments.", 1),
  createElderlyService("Elderly Grooming Assistant", "elderly-grooming-assistant", 375.00, "Hair combing, gentle face washing, nail trimming, skin lotion, and tidy personal grooming.", 1),
  createElderlyService("Elderly Toileting Assistance", "elderly-toileting-assistance", 437.50, "Dignified assistance with commode, bathroom transfers, hygiene cleanup, and adult diapers.", 1),
  createElderlyService("Elderly Bedside Assistant", "elderly-bedside-assistant", 437.50, "Attentive bedside companionship, prompt call response, water serving, and comfort checks.", 2),
  createElderlyService("Elderly Bed Transfer Assistant", "elderly-bed-transfer-assistant", 437.50, "Safe, ergonomic physical assistance moving between bed, wheelchair, recliner, and sofa.", 1),
  createElderlyService("Elderly Exercise Companion", "elderly-exercise-companion", 375.00, "Supervised gentle stretches, prescribed physiotherapy movement prompts, and light yoga.", 1),
  createElderlyService("Elderly Reading Companion", "elderly-reading-companion", 312.50, "Reading daily Odia, English, or Hindi newspapers, magazines, novels, and religious texts aloud.", 1),
  createElderlyService("Elderly Conversation Companion", "elderly-conversation-companion", 312.50, "Engaging discussions about life stories, culture, news, and empathetic, listening presence.", 1),
  createElderlyService("Elderly Entertainment Companion", "elderly-entertainment-companion", 312.50, "Playing cards, carrom, chess, listening to bhajans, or watching favorite classic shows together.", 2),
  createElderlyService("Elderly Shopping Assistant", "elderly-shopping-assistant", 312.50, "Accompanying seniors to local markets, grocery stores, or carrying shopping bags safely.", 2),
  createElderlyService("Elderly Errand Assistant", "elderly-errand-assistant", 312.50, "Running neighborhood errands, collecting bills, picking up laundry, or banking accompaniment.", 2),
  createElderlyService("Elderly Appointment Companion", "elderly-appointment-companion", 375.00, "Accompanying seniors to doctor appointments, clinics, diagnostic centers, and eye checkups.", 2),
  createElderlyService("Elderly Hospital Visit Companion", "elderly-hospital-visit-companion", 437.50, "Hospital visit support, queue waiting, wheelchair assistance, and holding medical reports.", 3),
  createElderlyService("Elderly Medication Reminder Assistant", "elderly-medication-reminder-assistant", 312.50, "Timely reminders for prescribed medicines, glass of water assistance, and keeping medicine log.", 1),
  createElderlyService("Elderly Meal Preparation Assistant", "elderly-meal-preparation-assistant", 312.50, "Preparing soft, low-oil, diabetic-friendly, or doctor-recommended home-cooked meals.", 2),
  createElderlyService("Elderly Household Assistance", "elderly-household-assistance", 312.50, "Light housekeeping, tidying living room, bed making, and ensuring clean, hazard-free walkways.", 2),
  createElderlyService("Elderly Room Organization Assistant", "elderly-room-organization-assistant", 250.00, "Organizing bedside table, medicine shelves, wardrobe, and keeping essentials easily accessible.", 2),
  createElderlyService("Elderly Laundry Assistance", "elderly-laundry-assistance", 250.00, "Washing, sun-drying, ironing, and neatly storing senior citizens' clothes and bed linens.", 2),
  createElderlyService("Elderly Day Companion", "elderly-day-companion", 312.50, "Full day companionship, routine supervision, lunchtime company, and peaceful afternoon support.", 4),
  createElderlyService("Elderly Evening Companion", "elderly-evening-companion", 343.75, "Evening tea, veranda relaxation, spiritual discourses, and dinner accompaniment.", 3),
  createElderlyService("Elderly Night Assistant", "elderly-night-assistant", 437.50, "Overnight alert support, nocturnal bathroom accompaniment, and soothing emergency readiness.", 4),
  createElderlyService("Elderly Emergency Assistance", "elderly-emergency-assistance", 500.00, "Rapid-response hourly helper for sudden senior care assistance and home emergencies.", 2),
  createElderlyService("Senior Citizen Travel Companion", "senior-citizen-travel-companion", 437.50, "Station or airport escort, luggage assistance, ticketing queue help, and traveling peace of mind.", 3),
  createElderlyService("Senior Citizen Outdoor Companion", "senior-citizen-outdoor-companion", 375.00, "Supervised visits to parks, community halls, relative visits, and fresh air strolls.", 2),
  createElderlyService("Senior Citizen Religious Visit Companion", "senior-citizen-religious-visit-companion", 375.00, "Escorting to temples, shrines, religious discourses, puja pandals, and sacred gatherings in Odisha.", 3),
  createElderlyService("Senior Citizen Market Companion", "senior-citizen-market-companion", 375.00, "Accompanying to vegetable and fish markets, bargaining assistance, and carrying heavy bags.", 2),
  createElderlyService("Senior Citizen Social Companion", "senior-citizen-social-companion", 312.50, "Accompanying to weddings, family feasts, society meetings, and social gatherings.", 3),

  // Family Care (71-75)
  createBabyService("Family Care Assistant — Child", "family-care-assistant-child", 375.00, "Dedicated family assistant focusing on child supervision, activity support, and home peace.", 2),
  createElderlyService("Family Care Assistant — Elderly", "family-care-assistant-elderly", 375.00, "Dedicated family assistant catering to elder routine support, medication reminders, and comfort.", 2),
  createElderlyService("Family Care Assistant — Child & Elderly", "family-care-assistant-child-elderly", 437.50, "Dual-generation household support assisting both young children and elder family members.", 3),
  createElderlyService("Daytime Family Caregiver", "daytime-family-caregiver", 375.00, "Comprehensive daytime family care assistance, managing schedules, and household harmony.", 4),
  createElderlyService("Overnight Family Care Assistant", "overnight-family-care-assistant", 500.00, "Reliable nighttime family care assistant for restful sleep, infant feeds, or elder nocturnal needs.", 4)
];
