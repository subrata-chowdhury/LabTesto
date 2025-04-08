const tags = [
    { icon: "💖", text: "All testimonials" },
    { icon: "📹️", text: "Video testimonials" },
    { icon: "📚️", text: "Love from Creators" },
    { icon: "🖥️", text: "Love from SaaS" },
    { icon: "👔", text: "Love from Agencies" },
    { icon: "♻️", text: "People who switched" }
];

const testimonials: TestimonialType[] = [
    {
        type: "image",
        thumbnail: "/testimonial-thumb.webp",
        height: 200,
        top: 100,
        name: "Ed Leake",
        website: "edleake.com",
        text: "HUGE fan of the Brandscreen product and team. Less than a month into implementing Brandscreen and I've already seen a tangible impact on revenue and conversion by sharing more social proof.",
        date: "Jun 6, 2023",
        stars: 5
    },
    {
        type: "text",
        profilePic: "/images/profile-pics/1.avif",
        name: "Ed Leake",
        website: "edleake.com",
        text: "I was so surprised how easily Brandscreen could do what I hoped it to be able to that I subscribed within the first hour and I'm gonna port it to my other company during the day 😅",
        date: "Jun 6, 2023",
        stars: 4
    },
    {
        type: "text",
        profilePic: "/images/profile-pics/1.avif",
        name: "Ed Leake",
        website: "edleake.com",
        text: "We looked at several options to collect reviews from our customers, before settling on Brandscreen. What drew us to Brandscreen was the great user interface and how easy the product was to use. The setup was incredibly simple. It took less than 5 minutes to get started with collecting reviews. We were able to import existing reviews as well, which is such an important feature to have. Brandscreen seems like a well thought-out product. I'm really happy that we've found Brandscreen and will absolutely be recommending the product to our audience. If you're on the fence, sign up for a free trial and see how it works for you. Getting reviews from your audience is a great dopamine hit. Don't miss out on that!",
        date: "Jun 6, 2023",
        stars: 5
    },
    {
        type: "text",
        profilePic: "/images/profile-pics/1.avif",
        name: "Ed Leake",
        website: "edleake.com",
        text: "HUGE fan of the Brandscreen product and team. Less than a month into implementing Brandscreen and I've already seen a tangible impact on revenue and conversion by sharing more social proof.",
        date: "Jun 6, 2023",
        stars: 5
    },
    {
        type: "image",
        thumbnail: "/testimonial-thumb.webp",
        height: 200,
        top: 100,
        name: "Ed Leake",
        website: "edleake.com",
        text: "HUGE fan of the Brandscreen product and team. Less than a month into implementing Brandscreen and I've already seen a tangible impact on revenue and conversion by sharing more social proof.",
        date: "Jun 6, 2023",
        stars: 5
    },
    {
        type: "image",
        thumbnail: "/testimonial-thumb.webp",
        height: 300,
        top: 200,
        name: "Ed Leake",
        website: "edleake.com",
        // text: "HUGE fan of the Brandscreen product and team. Less than a month into implementing Brandscreen and I've already seen a tangible impact on revenue and conversion by sharing more social proof.",
        // date: "Jun 6, 2023",
        stars: 4
    },
    {
        type: "text",
        profilePic: "/images/profile-pics/1.avif",
        name: "Ed Leake",
        website: "edleake.com",
        text: "HUGE fan of the Brandscreen product and team. Less than a month into implementing Brandscreen and I've already seen a tangible impact on revenue and conversion by sharing more social proof.",
        date: "Jun 6, 2023",
        stars: 5
    },
    {
        type: "text",
        profilePic: "/images/profile-pics/1.avif",
        name: "Ed Leake",
        website: "edleake.com",
        text: "Absolutely Brandscreen's biggest fan. This app is changing the game on getting social proof and making it so effortless on my side. An easy investment to make that's already made a huge difference in being able to show the impact of my programs.",
        date: "Jun 6, 2023",
        stars: 5
    },
    {
        type: "text",
        profilePic: "/images/profile-pics/1.avif",
        name: "Ed Leake",
        website: "edleake.com",
        text: "I was so surprised how easily Brandscreen could do what I hoped it to be able to that I subscribed within the first hour and I'm gonna port it to my other company during the day 😅",
        date: "Jun 6, 2023",
        stars: 4
    },
    {
        type: "image",
        thumbnail: "/testimonial-thumb.webp",
        height: 300,
        top: 200,
        name: "Ed Leake",
        website: "edleake.com",
        // text: "HUGE fan of the Brandscreen product and team. Less than a month into implementing Brandscreen and I've already seen a tangible impact on revenue and conversion by sharing more social proof.",
        // date: "Jun 6, 2023",
        stars: 4
    },
    {
        type: "image",
        thumbnail: "/testimonial-thumb.webp",
        height: 220,
        top: 120,
        name: "Ed Leake",
        website: "edleake.com",
        // text: "HUGE fan of the Brandscreen product and team. Less than a month into implementing Brandscreen and I've already seen a tangible impact on revenue and conversion by sharing more social proof.",
        // date: "Jun 6, 2023",
        stars: 4
    },
    {
        type: "text",
        profilePic: "/images/profile-pics/1.avif",
        name: "Ed Leake",
        website: "edleake.com",
        text: "I was so surprised how easily Brandscreen could do what I hoped it to be able to that I subscribed within the first hour and I'm gonna port it to my other company during the day 😅",
        date: "Jun 6, 2023",
        stars: 0
    },
    {
        type: "text",
        profilePic: "/images/profile-pics/1.avif",
        name: "Ed Leake",
        website: "edleake.com",
        text: "Absolutely Brandscreen's biggest fan. This app is changing the game on getting social proof and making it so effortless on my side. An easy investment to make that's already made a huge difference in being able to show the impact of my programs.",
        date: "Jun 6, 2023",
        stars: 5
    },
    {
        type: "text",
        profilePic: "/images/profile-pics/1.avif",
        name: "Ed Leake",
        website: "edleake.com",
        text: "I was so surprised how easily Brandscreen could do what I hoped it to be able to that I subscribed within the first hour and I'm gonna port it to my other company during the day 😅",
        date: "Jun 6, 2023",
        stars: 4
    }
];

export default testimonials;
export { tags };

export type TestimonialType = {
    type: "text" | "image";
    profilePic?: string;
    thumbnail?: string;
    height?: number;
    top?: number;
    name: string;
    website: string;
    text?: string;
    date?: string;
    stars: number;
}