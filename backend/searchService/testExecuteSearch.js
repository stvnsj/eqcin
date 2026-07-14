const executeSearch = require("./executeSearch");

async function main() {
  const search = {
    resource: "facturas",
    where: {
      kind: "group",
      op: "AND",
      children: [
        {
          kind: "rule",
          field: "fecha",
          op: "gte",
          value: "2024-01-01",
        },
        {
          kind: "rule",
          field: "razon_social",
          op: "contains",
          value: "copec",
        },
      ],
    },
    sort: [{ field: "fecha", direction: "desc" }],
  };

  const rows = await executeSearch(search);
  console.log(rows);
}





async function main1() {
    const search = {
        resource: "facturas",
        where: {
            kind: "group",
            op: "AND",
            children: [
                { kind: "rule", field: "fecha", op: "gte", value: "2020-05-01" },
                { kind: "rule", field: "razon_social", op: "contains", value: "shell" }
            ]
        },
        sort: [{ field: "fecha", direction: "desc" }]
    }
    const rows = await executeSearch(search);
    console.log(rows);
}






main1().catch(console.error);
