import React, { useState, useEffect } from "react";
import KEYWORDS from "../data/Keywords";
import TYPES from "../data/Types"

import "./SearchParams.css";

const SearchParams = ({ requestCards }) => {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [activeColors, setActiveColors] = useState([]);
  const [colorOperator, setColorOperator] = useState("And/Or");
  const [allCardTypes, setAllCardTypes] = useState([]);
  const [allCardSets, setAllCardSets] = useState([]);
  const [cardSet, setCardSet] = useState("");

  const abilityWords = KEYWORDS.abilityWords;
  const keywordAbilities = KEYWORDS.keywordAbilities;
  const allKeywords = abilityWords.concat(keywordAbilities).sort();

  const getAllTypes = () => {
    const types = TYPES.sort()
    setAllCardTypes(types)
    return types;
  };

  const getAllSets = () => {
    fetch("https://api.magicthegathering.io/v1/sets").then((res) => {
      const sets = res.json().then((data) => {
        const setsData = data.sets;
        let setsArray = [];
        setsData.forEach((set) => {
          setsArray.push(set.code);
        });
        setAllCardSets(setsArray);
        return setsArray;
      });
      return sets;
    });
  };

  useEffect(() => {
    getAllTypes();
    getAllSets();
    setActiveColors([]);
  }, [setActiveColors]);

  return (
    <div className="search-params">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestCards(activeColors, colorOperator, cardSet, keyword, type);
        }}
      >
        <div className="search-params-colors">
          <label htmlFor="search-color-white" className="search-param">
            White
            <input
              className="search-param-checkbox"
              type="checkbox"
              id="search-color-white"
              name="search-color-white"
              value="White"
              defaultChecked
            ></input>
          </label>
          <label htmlFor="search-color-blue" className="search-param">
            Blue
            <input
              className="search-param-checkbox"
              type="checkbox"
              id="search-color-blue"
              name="search-color-blue"
              value="White"
              defaultChecked
            ></input>
          </label>
          <label htmlFor="search-color-red" className="search-param">
            Red
            <input
              className="search-param-checkbox"
              type="checkbox"
              id="search-color-red"
              name="search-color-red"
              value="red"
              defaultChecked
            ></input>
          </label>
          <label htmlFor="search-color-black" className="search-param">
            Black
            <input
              className="search-param-checkbox"
              type="checkbox"
              id="search-color-black"
              name="search-color-black"
              value="black"
              defaultChecked
            ></input>
          </label>
          <label htmlFor="search-color-green" className="search-param">
            Green
            <input
              className="search-param-checkbox"
              type="checkbox"
              id="search-color-green"
              name="search-color-green"
              value="green"
              defaultChecked
            ></input>
          </label>
        </div>
        <div className="search-param-color-operator">
          <label
            htmlFor="search-color-operation-selector"
            className="search-param"
          >
            Color Select Rule
            <select
              className="search-param-radio"
              id="search-color-operation-selector"
              name="search-color-operation-selector"
              onChange={(e) => setColorOperator(e.target.value)}
              onBlur={(e) => setColorOperator(e.target.value)}
            >
              <option>And/Or</option>
              <option>Or</option>
              <option>And</option>
            </select>
          </label>
        </div>
        <div className="search-params-terms">
          <div className="search-params-keywords">
            <label htmlFor="search-set" className="search-param">
              Card Set
              <select
                className="search-param-set"
                id="search-set"
                name="set"
                onChange={(e) => setCardSet(e.target.value)}
                onBlur={(e) => setCardSet(e.target.value)}
              >
                <option></option>
                {allCardSets.map((set) => (
                  <option key={set} value={set}>
                    {set}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="search-params-keywords">
            <label htmlFor="search-keyword" className="search-param">
              Keyword
              <select
                className="search-param-keyword"
                id="search-keyword"
                name="keyword"
                onChange={(e) => setKeyword(e.target.value)}
                onBlur={(e) => setKeyword(e.target.value)}
              >
                <option></option>
                {allKeywords.map((keyword) => (
                  <option key={keyword} value={keyword}>
                    {keyword}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="search-params-types">
            <label htmlFor="search-type" className="search-param">
              Type
              <select
                className="search-param-type"
                id="search-type"
                name="type"
                onChange={(e) => setType(e.target.value)}
                onBlur={(e) => setType(e.target.value)}
              >
                <option></option>
                {allCardTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default SearchParams;
