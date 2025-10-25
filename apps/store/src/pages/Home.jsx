import Hero from "../components/Hero";
import Featured from "../components/Featured";
import SearchBar from "../components/SearchBar";
import NewArrivals from "../components/NewArrivals";
import PlantStands from "../components/PlantStands";
import Banner from "../components/Banner";

export default function Home() {
  return (
    <>
      <Hero />
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured</h2>
            <a href="#" className="view-all">
              view all
            </a>
          </div>
          <Featured />
        </div>
      </section>
      <section className="section light">
        <div className="container">
          <SearchBar />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Colorful New Arrivals</h2>
            <a href="#" className="view-all">
              view all
            </a>
          </div>
          <NewArrivals />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Plant stands</h2>
          </div>
          <PlantStands />
        </div>
      </section>
      <Banner />
    </>
  );
}
