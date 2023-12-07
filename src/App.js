import "./App.css";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function App() {
  const [langaugeData, setLangaugeData] = useState([]);
  const [output, setOutput] = useState("");

  useEffect(() => {
    // run this command when value changes
    console.log("output: ", output);
    document.getElementById("output_of_code").innerText = output?.stdout
      ? output?.stdout
      : "";
  }, [output]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const url = "https://judge0-ce.p.rapidapi.com/languages";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "312a0d93f0msh88b061e76dae04bp1b370ajsn8921fe8ecea6",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
    };

    try {
      fetch(url, options)
        .then((res) => res.json())
        .then((res) => {
          setLangaugeData(res);
          console.log("res?.text(): ", res);
        });
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
      const url =
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*";
      await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Content-Type": "application/json",
          "X-RapidAPI-Key":
            "312a0d93f0msh88b061e76dae04bp1b370ajsn8921fe8ecea6",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          source_code: formik?.values?.source_code,
          stdin: null,
          // stdin: btoa(formik?.values?.stdin),
          language_id: formik?.values?.language_id,
        }),
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res?.token) {
            console.log("res: ", res);
            console.log("res.token: ", res.token);
            // let url =
            //   "https://judge0-ce.p.rapidapi.com/submissions/" +
            //   res.token +
            //   "?base64_encoded=false&fields=*";
            const url = `https://judge0-ce.p.rapidapi.com/submissions/${res?.token}?base64_encoded=false&fields=*`;
            const options = {
              method: "GET",
              headers: {
                "X-RapidAPI-Key":
                  "312a0d93f0msh88b061e76dae04bp1b370ajsn8921fe8ecea6",
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              },
            };

            try {
              const response = await fetch(url, options);
              const result = await response.json();
              console.log(result);
              setOutput(result);
            } catch (error) {
              console.error(error);
            }
          }
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
        <textarea
          name="output_of_code"
          id="output_of_code"
          cols="30"
          rows="10"
          disabled
        ></textarea>
        <button onClick={formik.handleSubmit}>Submit</button>
      </form>
    </>
  );
}

export default App;
