import { useState } from "react";

interface ICar {
  id: number;
  regNumber: string;
  brand: string;
}

export default function App() {
  // 1. State för listan av bilar (förfylld med lite testdata)
  const [cars, setCars] = useState<ICar[]>([
    { id: 1, regNumber: "ABC123", brand: "Volvo" },
    { id: 2, regNumber: "XYZ789", brand: "Saab" },
  ]);

  // 2. State för formulärets inmatningsfält
  const [regNumber, setRegNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [shake, setShake] = useState(false);
  const [hasTried, setHasTried] = useState(false);

  const regnumberRegex = /^[A-Z]{3}[0-9]{2}([0-9]{1}|[A-Z]{1})$/;
  const brandRegex = /^[A-Z]{1}[a-z]+$/;

  const trimmedReg = regNumber.trim().toUpperCase();
  const trimmedBrand = brand.trim();
  const isRegValid = regnumberRegex.test(trimmedReg);
  const isBrandValid = brandRegex.test(trimmedBrand);
  const isInputValid = isBrandValid && isRegValid;

  //BORDER COLOR PICKERS
  const regBorderShowGreen = hasTried && isRegValid;
  const regBorderShowRed = hasTried && !isRegValid;

  const brandBorderShowGreen = hasTried && isBrandValid;
  const brandBorderShowRed = hasTried && !isBrandValid;

  const brandInputColorPicker = brandBorderShowGreen
    ? "border-green-500"
    : brandBorderShowRed
      ? "border-red-500"
      : "border-slate-500";

  const regInputBorderColorPicker = regBorderShowGreen
    ? "border-green-500"
    : regBorderShowRed
      ? "border-red-500"
      : "border-slate-500";

  const errors: string[] = [];
  if (!isRegValid) errors.push("Ogiltigt regnummer, t.ex. ABC123");
  if (!isBrandValid) errors.push("Ogiltigt märke, t.ex. Volvo");

  let errorBox = null;
  if (hasTried && errors.length > 0) {
    errorBox = (
      <div className="top-0 ml-20  mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm space-y-1">
        {errors.map((msg) => (
          <p key={msg}>{msg}</p>
        ))}
      </div>
    );
  }

  const handleAddCar = () => {
    if (!isInputValid) {
      setHasTried(true);
      setShake(true);
      return;
    }

    const newCar = {
      id: Date.now(),
      regNumber: trimmedReg,
      brand: trimmedBrand,
    };
    setCars((prev) => [...prev, newCar]);
    setRegNumber("");
    setBrand("");
    setHasTried(false);
  };

  const handleDeleteCar = (id: number) => {
    const filteredArray = cars.filter((x) => x.id !== id);
    setCars(filteredArray);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-xl mx-auto">
        <header className="mb-8 ">
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">
            Minigaraget
          </h1>
          <p className="text-slate-400">
            Antal bilar i garaget:{" "}
            <span className="font-semibold text-white">{cars.length}</span>
          </p>
        </header>

        {/* Formulär för att parkera fordon */}
        <div className="bg-slate-800 relative p-6 rounded-xl border border-slate-700 shadow-lg mb-8">
          <h2 className="text-xl  font-semibold mb-4 text-emerald-300">
            Parkera nytt fordon
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Regnummer
              </label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => {
                  setRegNumber(e.target.value);
                }}
                placeholder="t.ex. ABC123"
                className={`w-full ${regInputBorderColorPicker} bg-slate-900 border rounded-lg px-4 py-2 text-white uppercase focus:outline-none focus:border-emerald-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Märke
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
                placeholder="t.ex. Volvo"
                className={` ${brandInputColorPicker} w-full bg-slate-900 border  rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500`}
              />
            </div>
            <div className="flex ">
              <button
                type="button"
                onClick={handleAddCar}
                onAnimationEnd={() => setShake(false)}
                className={` ${shake ? "shake" : ""} bg-gray-600 border-slate-700 mt-4 mb-4 min-w-30 w-40 h-15 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer shadow-md`}
              >
                Parkera bil
              </button>
              <div className="min-h-4">{errorBox}</div>
            </div>
          </div>
        </div>

        {/* Lista över parkerade fordon */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-emerald-300">
            Parkerade fordon
          </h2>

          {cars.length === 0 ? (
            <p className="text-slate-500 text-center py-8 bg-slate-800/50 rounded-xl border border-slate-800">
              Garaget är helt tomt.
            </p>
          ) : (
            <div className="space-y-3">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono px-2.5 py-1 rounded border border-emerald-500/30 uppercase font-semibold">
                      {car.regNumber}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {car.brand}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 transition-all cursor-pointer"
                  >
                    Ta bort
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
