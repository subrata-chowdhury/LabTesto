# LabTesto
It is a full stack web app where user can book any medical test from any lab. It also comes with a powerful admin panel.

## Features:
### Main Features:
1. User can **search any Tests** without logging in.
2. User can **view test and lab details** wihout loggin in.
3. Has **login, sign up** feature.
4. User can **order** any tests.
5. User can **select any lab** for the test.
6. User can **store multiple patient and address** details.
7. User can **reset there password**.
8. User can view **previously ordered** tests.
9. User can **see** assign **collector details** for specific orders.
10. User **can cancel the order** before Sample Collection.
11. User can **view / change** his **profile details**.
12. User data are **secure** and **no one can access** other user's data by other users.
13. User can leave a **review** after all the order's procedure is completed.
14. User can **put** there **tests in cart**.
15. User can choose to **provide the patient details at the collection time**.

### Admin Features:
1. Admin User can **add, edit & delete** any **Tests, Labs, User, Collectors & Orders**.
2. Admin User can see **statisctics related Tests, Labs, Orders Also Financial Details** like total income vs total expenses per month.
3. Admin User can also check **data misses** for any Labs.
4. Admin Users has **top level permissions** to the entire database.
5. **Has a rich text editor** with many features like table, alignment, bold, italic, underline, fontsize, links and many more.

### Routes
**`/admin`**: This route contains **all the admin pages** for the app where admins can add/edit/delete tests, labs make a order for users. <br/>
This has top level permissions.

**`/collector`**: This route contains **all the pages required for collectors** like assign orders, previously assign orders etc.

**`/`**: Routes except `/admin` and `/collector` are for Users where user can search view Tests and order them.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
