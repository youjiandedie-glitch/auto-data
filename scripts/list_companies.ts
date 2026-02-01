import prisma from "../src/lib/prisma";

async function main() {
    const companies = await prisma.company.findMany();
    console.log(JSON.stringify(companies, null, 2));
}

main();
