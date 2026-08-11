import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "./context/api/api";

const LandingPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const { data } = await api.get("cars/view_cars/");

      // In case the API returns an object instead of a direct array
      setCars(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load our vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const availableCars = useMemo(() => {
    return cars.filter(
      (car) => car.status?.toLowerCase() === "available"
    );
  }, [cars]);

  const filteredCars = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return availableCars;
    }

    return availableCars.filter((car) => {
      const brand = String(car.brand || "").toLowerCase();
      const year = String(car.year || "").toLowerCase();

      return (
        brand.includes(term) ||
        year.includes(term)
      );
    });
  }, [availableCars, searchTerm]);

  const scrollToInventory = () => {
    document
      .getElementById("inventory")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="absolute left-0 right-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">

          <button
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <img
                src="/motorhub.png"
                alt="Motorhub"
                className="h-11 w-11 rounded-xl object-cover"
              />            </div>

            <div className="text-left">
              <p className="text-lg font-bold tracking-tight text-white">
                Motorhub
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
                Automotive
              </p>
            </div>
          </button>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <button
              onClick={scrollToInventory}
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              Inventory
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              Why Motorhub
            </button>

            <button
              onClick={scrollToContact}
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              Contact
            </button>
          </div>

          {/* Login */}
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-blue-900"
          >
            Login
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[680px] items-center overflow-hidden bg-blue-950">

        <div className="absolute inset-0">

          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury vehicle"
            className="h-full w-full object-cover"
          />

          {/* Dark base */}
          <div className="absolute inset-0 bg-slate-950/65" />

          {/* Main blue atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/70 to-blue-950/25" />

          {/* Red brand accent on the right */}
          <div className="absolute inset-y-0 right-0 w-[38%] bg-gradient-to-l from-red-700/25 via-red-600/10 to-transparent" />

          {/* Soft darkening around edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

        </div>


        {/* Hero content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-32 lg:px-8">

          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-red-500" />

              <span className="text-xs font-semibold text-white/80">
                Your next drive starts here
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find a car that
              <span className="block text-blue-400">
                feels right.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Explore our carefully selected vehicles and find the one
              that fits your journey. Browse our inventory and request
              a quote directly from our team.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={scrollToInventory}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Explore Inventory
                <i className="bi bi-arrow-down" />
              </button>

              <button
                onClick={scrollToContact}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Talk to us
                <i className="bi bi-arrow-right" />
              </button>

            </div>
          </div>

          {/* Hero bottom stats */}
          <div className="mt-16 grid max-w-2xl grid-cols-3 border-t border-white/10 pt-6">

            <div>
              <p className="text-2xl font-bold text-white">
                {availableCars.length}+
              </p>

              <p className="mt-1 text-xs text-white/50">
                Vehicles available
              </p>
            </div>

            <div className="border-l border-white/10 pl-5">
              <p className="text-2xl font-bold text-white">
                100%
              </p>

              <p className="mt-1 text-xs text-white/50">
                Customer focused
              </p>
            </div>

            <div className="border-l border-white/10 pl-5">
              <p className="text-2xl font-bold text-white">
                Easy
              </p>

              <p className="mt-1 text-xs text-white/50">
                Quote requests
              </p>
            </div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ================= INVENTORY ================= */}
      <section
        id="inventory"
        className="scroll-mt-10 px-5 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          {/* Section heading */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
                Our inventory
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Explore our vehicles
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Browse our available vehicles and find one that matches
                what you're looking for.
              </p>
            </div>

            <span className="text-sm font-medium text-slate-400">
              {filteredCars.length}{" "}
              {filteredCars.length === 1 ? "vehicle" : "vehicles"} found
            </span>
          </div>

          {/* ================= SEARCH ================= */}
          <div className="mb-10 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <div className="relative">

              <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

              <input
                type="text"
                placeholder="Search by brand, VIN, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-blue-100 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-red-500"
                  aria-label="Clear search"
                >
                  <i className="bi bi-x-circle-fill" />
                </button>
              )}

            </div>

            {searchTerm && (
              <p className="mt-3 text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-blue-600">
                  {filteredCars.length}
                </span>{" "}
                matching{" "}
                {filteredCars.length === 1 ? "vehicle" : "vehicles"}.
              </p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-56 bg-slate-200" />

                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 rounded bg-slate-200" />
                    <div className="h-4 w-1/3 rounded bg-slate-100" />
                    <div className="h-10 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No vehicles at all */}
          {!loading && availableCars.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-20 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <i className="bi bi-car-front text-2xl" />
              </div>

              <h3 className="mt-5 font-semibold text-slate-800">
                No vehicles available right now
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Check back soon for new arrivals.
              </p>

            </div>
          )}

          {/* Search returned no results */}
          {!loading &&
            availableCars.length > 0 &&
            filteredCars.length === 0 && (
              <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-6 py-20 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm">
                  <i className="bi bi-search text-2xl" />
                </div>

                <h3 className="mt-5 font-semibold text-slate-800">
                  No vehicles found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try searching for a different brand, VIN, or year.
                </p>

                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Clear Search
                </button>

              </div>
            )}

          {/* Cars */}
          {!loading && filteredCars.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >

                  {/* Image */}
                  <div className="relative h-60 overflow-hidden bg-slate-100">

                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.brand || "Vehicle"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <i className="bi bi-car-front text-5xl" />
                      </div>
                    )}

                    {/* Available badge */}
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Available
                      </span>
                    </div>

                  </div>

                  {/* Details */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {car.brand || "Unknown Vehicle"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {car.year || "Year not specified"}
                        </p>
                      </div>

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <i className="bi bi-car-front" />
                      </div>

                    </div>

                    <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">

                      <span>
                        <i className="bi bi-calendar3 mr-1.5 text-blue-500" />
                        {car.year || "N/A"}
                      </span>

                      <span>
                        <i className="bi bi-patch-check mr-1.5 text-red-500" />
                        Verified
                      </span>

                    </div>

                    <button
                      onClick={() =>
                        navigate(`request-quote/${car.id}`)
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Request A Quote
                      <i className="bi bi-arrow-right" />
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </section>

      {/* ================= WHY MOTORHUB ================= */}
      <section
        id="about"
        className="scroll-mt-10 bg-blue-50/40 px-5 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
              Why Motorhub
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              A simpler way to find your next car.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              We keep the process straightforward. Explore our inventory,
              find a vehicle you like and reach out to our team when you're
              ready to know more.
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {/* Card 1 */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <i className="bi bi-search text-lg" />
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                Browse with ease
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Explore our available vehicles and quickly find something
                that catches your eye.
              </p>

            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <i className="bi bi-chat-square-text text-lg" />
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                Request a quote
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Found something you like? Send us an enquiry and our team
                can provide the information you need.
              </p>

            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <i className="bi bi-person-check text-lg" />
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                Deal with confidence
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Our team is here to help you through the next steps when
                you're ready to make a decision.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section
        id="contact"
        className="scroll-mt-10 px-5 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-3xl bg-blue-950 px-6 py-14 text-center sm:px-12">

            {/* Decorative circles */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-red-500/20" />

            <div className="relative mx-auto max-w-2xl">

              <p className="text-sm font-bold uppercase tracking-widest text-red-400">
                Ready to find yours?
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Have a vehicle in mind?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60">
                Browse our inventory and send us a quote request.
                We'll be happy to help you with the next step.
              </p>

              <button
                onClick={scrollToInventory}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-500"
              >
                Browse Vehicles
                <i className="bi bi-arrow-right" />
              </button>

            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-blue-100 bg-white px-5 py-8">
        <div className="mx-auto flex max-w-7xl justify-center">
          <p className="text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Motorhub by Sophie Kendi. All rights reserved.
          </p>
        </div>
      </footer>    </div>
  );
};

export default LandingPage;

