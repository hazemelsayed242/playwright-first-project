import { test, expect, request } from "@playwright/test";

// ! _START_ API Tests by ChatGpt Learning Step By Step.
let objectId;
let fullUrlPathWithId;
const baseUrl = "https://api.restful-api.dev/";
const objectPath = "objects";
const fullUrlPath = baseUrl + objectPath;

// test("First Attempt to Create objects", async ({ request }) => {
//   /**
//    *! Effectively testing:
//    ** Test that the oject returned from GET /objects/{id} is the same object that the API reported as created by POST /objects.
//    */
//   const payload = {
//     name: "Samsung Galaxy A56",
//     data: {
//       year: 2024,
//       price: 24000,
//       CPU_model: "Samsung Exynos 1580 (4 nm)",
//       Hard_disk_size: "256GB",
//     },
//   };
//   const response = await request.post(baseUrl, {
//     data: payload,
//   });
//   expect(response.status()).toBe(200);
//   const responseBody = await response.json();
//   // console.log("STATUS:", response.status());
//   // console.log("BODY:", await response.text());
//   //* POST response Assertions:
//   expect(responseBody.name).toBe(payload.name); //? toContain() - don't use for numbers, instead use toBe()
//   expect(responseBody.data.year).toBe(payload.data.year);
//   expect(responseBody.data.price).toBe(payload.data.price);
//   expect(responseBody.data.CPU_model).toBe(payload.data.CPU_model);
//   expect(responseBody.data.Hard_disk_size).toBe(payload.data.Hard_disk_size);
//   //* Take the server-generated ID and use it dynamically:
//   const objectId = responseBody.id;
//   const getResponse  = await request.get(`${baseUrl}/${objectId}`);
//   expect(getResponse .status()).toBe(200);
//   console.log(getResponse );
//   //* GET response Assertions:
//   const getResponseBody = await getResponse .json();
//   expect(getResponseBody.id).toBe(objectId);
//   expect(getResponseBody).toHaveProperty("name", "Samsung Galaxy A56");

//   //* PUT: (replaces an entire resource with new representation)
//   // const putResponse = await request.put(`${baseUrl}/${objectId}`, {
//   //   data: {
//   //     name: "Samsung Galaxy A56 5G - put_updated",
//   //     data: {
//   //       year: 2025,
//   //       price: 25000,
//   //       CPU_model: "Samsung Exynos 1580 (4 nm)",
//   //       Hard_disk_size: "256GB",
//   //     },
//   //   },
//   // });
//   // expect(putResponse.status()).toBe(200);
//   // const putResponseBody = await putResponse.json();
//   // console.log(putResponseBody);
//   // expect(putResponseBody).toHaveProperty(
//   //   "name",
//   //   "Samsung Galaxy A56 5G - put_updated",
//   // );
//   // expect(putResponseBody).toHaveProperty("data.year", 2025);
//   // expect(putResponseBody).toHaveProperty("data.price", 25000);
//   // expect(putResponseBody).toHaveProperty(
//   //   "data.CPU_model",
//   //   "Samsung Exynos 1580 (4 nm)",
//   // );
//   //* PATCH: (applies partial modifications to a resource):
//   // const responsePatch = await request.patch(`${baseUrl}/${objectId}`, {
//   //   data: {
//   //     name: "Samsung Galaxy A56 5G - patch_updated",
//   //   },
//   // });
//   // expect(responsePatch.status()).toBe(200);
//   // const patchResponseBody = await responsePatch.json();
//   // console.log(patchResponseBody);
//   // expect(patchResponseBody).toHaveProperty(
//   //   "name",
//   //   "Samsung Galaxy A56 5G - patch_updated",
//   // );
//   //* DELETE:
//   const responseDelete = await request.delete(`${baseUrl}/${objectId}`);
//   expect(responseDelete.status()).toBe(200);

//   const responseDeleteBody = await responseDelete.json();
//   console.log(responseDeleteBody);
//   expect(responseDeleteBody.message).toBe(
//     `Object with id = ${objectId} has been deleted.`,
//   );
// });
// ! _END_ API Tests by ChatGpt Learning Step By Step.

test("Get objects", async ({ request }) => {
  const response = await request.get(fullUrlPath);
  const responseBody = await response.json();
  const responseHeaders = response.headers();

  expect(response).toBeOK(); // assert status code to be between 200-299

  //* If you're testing that specific data exists, "Does the response contain an object whose name is Google Pixel 6 Pro?"
  const googlePixel = responseBody.find(
    (item: { name: string }) => item.name === "Google Pixel 6 Pro",
  );
  expect(googlePixel).toHaveProperty("name", "Google Pixel 6 Pro"); // _if_ you want to assert the actual object:
  // expect(googlePixel).toBeDefined();                              // _OR_ "Does the response contain an object whose name is Google Pixel 6 Pro?"

  //* If you're testing the endpoint's contract/structure, _Hard Code_ "The first object returned by this API must be Google Pixel 6 Pro."
  const firstObject = responseBody[0];
  expect(firstObject).toHaveProperty("name", "Google Pixel 6 Pro");

  // console.log(responseHeaders);
  expect(responseHeaders["content-type"]).toContain("application/json"); // assert headers
});

test("should create an object", async ({ request }) => {
  const payload = {
    name: "Apple MacBook Pro 16",
    data: {
      year: 2019,
      price: 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB",
    },
  };

  const response = await request.post(fullUrlPath, {
    data: payload,
  });

  expect(response).toBeOK();
  const responseBody = await response.json();
  expect(responseBody.name).toBe(payload.name);
  expect(responseBody.data.year).toBe(payload.data.year);
  expect(responseBody.data.price).toBe(payload.data.price);
  expect(responseBody.data["CPU model"]).toBe(payload.data["CPU model"]);
  expect(responseBody.data["Hard disk size"]).toBe(
    payload.data["Hard disk size"],
  );

  objectId = responseBody.id;
  fullUrlPathWithId = `${fullUrlPath}/${objectId}`;
});

test("should retrieve an object by ID", async ({ request }) => {
  const payload = {
    name: "Apple MacBook Pro 16",
    data: {
      year: 2019,
      price: 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB",
    },
  };

  const response = await request.post(fullUrlPath, {
    data: payload,
  });
  expect(response).toBeOK();
  const responseBody = await response.json();

  objectId = responseBody.id;
  fullUrlPathWithId = `${fullUrlPath}/${objectId}`;

  const getResponse = await request.get(fullUrlPathWithId);
  expect(getResponse).toBeOK();

  const getResponseBody = await getResponse.json();
  expect(responseBody.id).toBe(getResponseBody.id);
  expect(getResponseBody.name).toBe(payload.name);
  expect(getResponseBody.data.year).toBe(payload.data.year);
  expect(getResponseBody.data.price).toBe(payload.data.price);
  expect(getResponseBody.data["CPU model"]).toBe(payload.data["CPU model"]);
  expect(getResponseBody.data["Hard disk size"]).toBe(
    payload.data["Hard disk size"],
  );
});

test("should update an object by ID", async ({ request }) => {
  const payload = {
    name: "Apple MacBook Pro 16",
    data: {
      year: 2019,
      price: 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB",
    },
  };
  const response = await request.post(fullUrlPath, {
    data: payload,
  });
  expect(response).toBeOK();
  const responseBody = await response.json();

  expect(responseBody.name).toBe(payload.name);
  expect(responseBody.data.year).toBe(payload.data.year);
  expect(responseBody.data.price).toBe(payload.data.price);
  expect(responseBody.data["CPU model"]).toBe(payload.data["CPU model"]);
  expect(responseBody.data["Hard disk size"]).toBe(
    payload.data["Hard disk size"],
  );

  objectId = responseBody.id;
  fullUrlPathWithId = `${fullUrlPath}/${objectId}`;

  const putPayload = {
    name: "Apple MacBook Pro 18",
    data: {
      year: 2026,
      price: 150000,
      "CPU model": "m3",
      "Hard disk size": "512GB",
    },
  };
  const putResponse = await request.put(fullUrlPathWithId, {
    data: putPayload,
  });

  expect(putResponse).toBeOK();
  const putResponseBody = await putResponse.json();

  expect(putResponseBody.name).toBe(putPayload.name);
  expect(putResponseBody.data.year).toBe(putPayload.data.year);
  expect(putResponseBody.data.price).toBe(putPayload.data.price);
  expect(putResponseBody.data["CPU model"]).toBe(putPayload.data["CPU model"]);
  expect(putResponseBody.data["Hard disk size"]).toBe(
    putPayload.data["Hard disk size"],
  );

  const getResponse = await request.get(fullUrlPathWithId);
  expect(getResponse).toBeOK();
  const getResponseBody = await getResponse.json();

  expect(getResponseBody.name).toBe(putPayload.name);
  expect(getResponseBody.data.year).toBe(putPayload.data.year);
  expect(getResponseBody.data.price).toBe(putPayload.data.price);
  expect(getResponseBody.data["CPU model"]).toBe(putPayload.data["CPU model"]);
  expect(getResponseBody.data["Hard disk size"]).toBe(
    putPayload.data["Hard disk size"],
  );
});

test("should delete an object by ID", async ({ request }) => {
  const payload = {
    name: "Apple MacBook Pro 16",
    data: {
      year: 2019,
      price: 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB",
    },
  };
  const response = await request.post(fullUrlPath, {
    data: payload,
  });
  expect(response).toBeOK();
  const responseBody = await response.json();

  expect(responseBody.name).toBe(payload.name);
  expect(responseBody.data.year).toBe(payload.data.year);
  expect(responseBody.data.price).toBe(payload.data.price);
  expect(responseBody.data["CPU model"]).toBe(payload.data["CPU model"]);
  expect(responseBody.data["Hard disk size"]).toBe(
    payload.data["Hard disk size"],
  );

  objectId = responseBody.id;
  fullUrlPathWithId = `${fullUrlPath}/${objectId}`;

  const deleteResponse = await request.delete(fullUrlPathWithId);
  expect(deleteResponse).toBeOK();

  const deleteResponseBody = await deleteResponse.json();
  // console.log("Message: " + deleteResponseBody.message);
  expect(deleteResponseBody.message).toBe(
    `Object with id = ${objectId} has been deleted.`,
  );

  const getAfterDelete = await request.get(fullUrlPathWithId);
  // console.log("GET after DELETE STATUS:", getAfterDelete.status()); //? incase we dont know the status
  // console.log("Body:", await getAfterDelete.text());

  expect(getAfterDelete.status()).toBe(404);

  const getAfterDeleteBody = await getAfterDelete.json();
  expect(getAfterDeleteBody.error).toBe(
    `Object with id=${objectId} was not found.`,
  );
});
