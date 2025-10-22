import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Featured from './components/Featured.jsx';
import SearchBar from './components/SearchBar.jsx';
import NewArrivals from './components/NewArrivals.jsx';
import PlantStands from './components/PlantStands.jsx';
import Banner from './components/Banner.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
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
      </main>
      <Footer />
    </div>
  );
}
