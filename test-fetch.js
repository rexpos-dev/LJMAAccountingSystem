async function test() {
    const res = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            requesterName: "Test",
            position: "Test",
            purpose: "Test",
            items: [{ description: "Test", quantity: 1, unitPrice: 1, price: 1, total: 1 }],
            amount: 1,
            total: 1
        })
    });
    const data = await res.json();
    console.log(data);
}
test();
