import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { promises as fs } from "fs";
import path from "path";

import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";

/*
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useState, useEffect } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home({ files }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const tabs = Object.keys(files).map((k) => ({ name: `v${k}`, version: k }));

  const [version, setVersion] = useState(tabs[1]);
  const [file, setFile] = useState(files[version.version][0]);
  const [format, setFormat] = useState("json");

  const updateVersion = (tab) => {
    setVersion(tab);
    setFile(files[tab.version][0]);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      Prism.highlightAll();
    }
  }, [file, format, version]);

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    <ul
                      role="list"
                      className="px-2 py-3 font-medium text-gray-900"
                    >
                      {files[version.version].map((f) => (
                        <li key={f.name}>
                          <a href={f.href} className="block px-2 py-3">
                            {f.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between pt-24">
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div></div>
              </Menu>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <div className="mb-5">
                  <h1 className="text-4xl mr-4 font-bold tracking-tight text-gray-900">
                    <BuildingStorefrontIcon className="inline-block mr-3 h-11 mb-3" />
                    Pet Store
                  </h1>
                  <span>A collection of OAS example files</span>
                </div>

                <div>
                  <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                      Select a tab
                    </label>
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                      id="tabs"
                      name="tabs"
                      className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      defaultValue={
                        tabs.find((tab) => version.version === tab.version).name
                      }
                    >
                      {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex" aria-label="Tabs">
                        {tabs.map((tab) => (
                          <a
                            key={tab.name}
                            onClick={() => updateVersion(tab)}
                            className={classNames(
                              tab.version == version.version
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                              "w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm"
                            )}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>

                <ul
                  role="list"
                  className="mt-6 border-gray-200 pb-6 text-sm font-medium text-gray-900"
                >
                  {files[version.version].map((f) => (
                    <li key={f.name}>
                      <a
                        href="#"
                        onClick={() => setFile(f)}
                        className={classNames(
                          f.name === file.name ? "bg-blue-50" : "",
                          "rounded-md block px-3 py-2"
                        )}
                      >
                        {f.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <a href="https://github.com/readmeio/petstore.dev/tree/main/oas" className="block pt-5 border-t border-gray-200 pl-3 text-sm text-gray-500 hover:text-indigo-600">
                  Edit specs on GitHub
                </a>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* Replace with your content */}
                <pre className="mt-3 rounded-b-lg text-sm leading-[1.5714285714] text-white sm:rounded-t-lg bg-[#1e293b]">
                  <div className="float-right p-3">
                    <div
                      className="flex space-x-1 rounded-lg bg-slate-600 p-0.5"
                      role="tablist"
                      aria-orientation="horizontal"
                    >
                      <button
                        className={classNames(
                          format === "json" ? "bg-white shadow" : "",
                          "flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3"
                        )}
                        id="headlessui-tabs-tab-2"
                        role="tab"
                        type="button"
                        aria-selected="true"
                        tabIndex="0"
                        aria-controls="headlessui-tabs-panel-4"
                        onClick={() => setFormat("json")}
                      >
                        <svg
                          className={classNames(
                            format === "json"
                              ? "fill-sky-500"
                              : "fill-slate-300",
                            "h-5 w-5 flex-none"
                          )}
                          viewBox="0 0 100 100"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <path d="m26 58v8c0 6.6289 5.3711 12 12 12h4v-8h-4c-2.2109 0-4-1.7891-4-4v-8c0-2.957-1.0977-5.8047-3.0781-8 1.9805-2.1953 3.0781-5.043 3.0781-8v-8c0-2.2109 1.7891-4 4-4h4v-8h-4c-6.6289 0-12 5.3711-12 12v8c0 1.0625-0.42188 2.0781-1.1719 2.8281s-1.7656 1.1719-2.8281 1.1719h-4v8h4c1.0625 0 2.0781 0.42188 2.8281 1.1719s1.1719 1.7656 1.1719 2.8281z" />
                            <path d="m74 42v-8c0-6.6289-5.3711-12-12-12h-4v8h4c1.0625 0 2.0781 0.42188 2.8281 1.1719s1.1719 1.7656 1.1719 2.8281v8c0 2.957 1.0977 5.8047 3.0781 8-1.9805 2.1953-3.0781 5.043-3.0781 8v8c0 1.0625-0.42188 2.0781-1.1719 2.8281s-1.7656 1.1719-2.8281 1.1719h-4v8h4c6.6289 0 12-5.3711 12-12v-8c0-2.2109 1.7891-4 4-4h4v-8h-4c-2.2109 0-4-1.7891-4-4z" />
                          </g>
                        </svg>
                        <span
                          className={classNames(
                            "sr-only lg:not-sr-only lg:ml-2",
                            format === "json"
                              ? "text-slate-700"
                              : "text-slate-200"
                          )}
                        >
                          JSON
                        </span>
                      </button>
                      <button
                        className={classNames(
                          format === "yaml" ? "bg-white shadow" : "",
                          "flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3"
                        )}
                        id="headlessui-tabs-tab-3"
                        role="tab"
                        type="button"
                        aria-selected="false"
                        onClick={() => setFormat("yaml")}
                        tabIndex="-1"
                      >
                        <svg
                          className={classNames(
                            format === "yaml"
                              ? "fill-sky-500"
                              : "fill-slate-300",
                            "h-5 w-5 flex-none"
                          )}
                          viewBox="0 0 100 100"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m78 19h-28c-2.2109 0-4 1.7891-4 4s1.7891 4 4 4h28c2.2109 0 4-1.7891 4-4s-1.7891-4-4-4z" />
                          <path d="m54 41c0-1.0625-0.42188-2.0781-1.1719-2.8281s-1.7656-1.1719-2.8281-1.1719h-28c-2.2109 0-4 1.7891-4 4s1.7891 4 4 4h28c1.0625 0 2.0781-0.42188 2.8281-1.1719s1.1719-1.7656 1.1719-2.8281z" />
                          <path d="m50 73h-28c-2.2109 0-4 1.7891-4 4s1.7891 4 4 4h28c2.2109 0 4-1.7891 4-4s-1.7891-4-4-4z" />
                          <path d="m78 55h-28c-2.2109 0-4 1.7891-4 4s1.7891 4 4 4h28c2.2109 0 4-1.7891 4-4s-1.7891-4-4-4z" />
                          <path d="m78 73h-10c-2.2109 0-4 1.7891-4 4s1.7891 4 4 4h10c2.2109 0 4-1.7891 4-4s-1.7891-4-4-4z" />
                          <path d="m22 55c-2.2109 0-4 1.7891-4 4s1.7891 4 4 4h10c2.2109 0 4-1.7891 4-4s-1.7891-4-4-4z" />
                          <path d="m32 19h-10c-2.2109 0-4 1.7891-4 4s1.7891 4 4 4h10c2.2109 0 4-1.7891 4-4s-1.7891-4-4-4z" />
                          <path d="m78 37h-10c-2.2109 0-4 1.7891-4 4s1.7891 4 4 4h10c2.2109 0 4-1.7891 4-4s-1.7891-4-4-4z" />
                        </svg>
                        <span
                          className={classNames(
                            "sr-only lg:not-sr-only lg:ml-2",
                            format === "yaml"
                              ? "text-slate-700"
                              : "text-slate-200"
                          )}
                        >
                          YAML
                        </span>
                      </button>
                    </div>
                  </div>
                  {format === "json" ? (
                    <code className="p-6 block language-json">{file.json}</code>
                  ) : (
                    <code className="p-6 block language-yaml">{file.yaml}</code>
                  )}
                </pre>
                {/* /End replace */}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
  const versions = {
    "2.0": [
      { name: "Petstore", file: "petstore" },
      { name: "Petstore Minimal", file: "petstore-minimal" },
      { name: "Petstore Simple", file: "petstore-simple" },
      { name: "Petstore Expanded", file: "petstore-expanded" },
      { name: "Simple API overview", file: "api-with-examples" },
      { name: "Uber", file: "uber" },
    ],
    "3.0": [
      { name: "Petstore", file: "petstore" },
      { name: "Petstore Expanded", file: "petstore-expanded" },
      { name: "Callback Example", file: "callback-example" },
      { name: "Link Example", file: "link-example" },
      { name: "Simple API overview", file: "api-with-examples" },
      { name: "USPTO", file: "uspto" },
    ],
    3.1: [
      { name: "Webhook Example", file: "webhook-example" },
      { name: "Non-OAuth Scopes", file: "non-oauth-scopes" },
    ],
  };

  const versionsOut = {};

  for (const v in versions) {
    const files = versions[v].map(async (f) => {
      const filePathJson = path.join(process.cwd(), "oas", v, `${f.file}.json`);
      const fileJson = await fs.readFile(filePathJson, "utf8");

      const filePathYaml = path.join(process.cwd(), "oas", v, `${f.file}.yaml`);
      const fileYaml = await fs.readFile(filePathYaml, "utf8");

      return {
        name: f.name,
        file: f.file,
        json: fileJson,
        yaml: fileYaml,
      };
    });
    versionsOut[v] = await Promise.all(files);
  }

  return {
    props: {
      files: versionsOut,
    },
  };
}
