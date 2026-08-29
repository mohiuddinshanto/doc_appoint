import { Button, Input } from "@heroui/react";
import { LuHeart, LuSearch } from "react-icons/lu";

type HomeHeroProps = {
  search: string;
  setSearch: (value: string) => void;
  handleSearch: () => void;
};

export function HomeHero({
  search,
  setSearch,
  handleSearch,
}: HomeHeroProps) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleSearch();
  }

  return (
    <section className="bg-indigo-900 px-4 py-16 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
          <LuHeart />
          Trusted Healthcare Booking Platform
        </p>

        <h1 className="mb-4 text-4xl font-bold sm:text-6xl">
          Find & Book Top-Rated Doctors
        </h1>

        <p className="mb-8 text-indigo-200">
          Choose a doctor, pick a time, and confirm your appointment.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl gap-2 rounded-2xl bg-white/10 p-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search doctor or specialty"
            classNames={{ inputWrapper: "bg-white" }}
          />
          <Button type="submit" color="primary" startContent={<LuSearch />}>
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}
