import "./App.css";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function App() {
  const [langaugeData, setLangaugeData] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const url = "https://judge0-ce.p.rapidapi.com/languages";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "312a0d93f0msh88b061e76dae04bp1b370ajsn8921fe8ecea6",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      setLangaugeData(result);
      console.log("result: ", result);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const formik = useFormik({
    initialValues: {
      source_code: "",
      stdin: "",
      language_id: 93,
    },
    onSubmit: async (values) => {
      console.log("values: ", values);
      alert(JSON.stringify(values, null, 2));
      //  e.preventDefault();
      // let outputText = document.getElementById("output");
      // outputText.innerHTML = "";
      // outputText.innerHTML += "Creating Submission ...\n";
      await fetch("https://judge0-ce.p.rapidapi.com/submissions", {
        method: "POST",
        headers: {
          "X-RapidAPI-Key":
            "312a0d93f0msh88b061e76dae04bp1b370ajsn8921fe8ecea6",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: btoa(formik?.values?.source_code),
          stdin: null,
          // stdin: btoa(formik?.values?.stdin),
          language_id: formik?.values?.language_id,
        }),
      })
        .then((res) => res.json())
        .then(async (res) => {
          console.log("res: ");
          let url = `https://judge0-ce.p.rapidapi.com/submissions/${res.token}?base64_encoded=true`;
          await fetch(url, {
            method: "GET",
            headers: {
              "X-RapidAPI-Key":
                "312a0d93f0msh88b061e76dae04bp1b370ajsn8921fe8ecea6",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "content-type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((res) => {
              console.log("res: ", res);
            });
        });
    },
  });
  return (
    <>
      <form>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select Language</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formik.values.language_id}
            label="Age"
            onChange={formik.handleChange}
          >
            {langaugeData?.length > 0 &&
              langaugeData?.map((item) => (
                <MenuItem value={item.id}>{item?.name}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <textarea
          {...formik.getFieldProps("source_code")}
          name="source_code"
          id="source_code"
          cols="30"
          rows="10"
        ></textarea>
        <button onClick={formik.handleSubmit}>Submit</button>
      </form>
    </>
  );
}

export default App;
