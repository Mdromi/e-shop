import Link from "next/link";
import { MdFacebook } from "react-icons/md";
import { AiFillTwitterCircle, AiFillInstagram, AiFillYoutube } from "react-icons/ai";
import Container from "../Container";
import FooterList from "./FooterList";

const footerData = [
  {
    title: "Shop Categories",
    links: ["Phones", "Laptops", "Desktops", "Watches", "Tvs", "Accessories"],
  },
  {
    title: "Customer Services",
    links: ["Contact Us", "Shipping Policy", "Return & Exchanges", "FAQs"],
  },
  {
    title: "About Us",
    content:
      "A comprehensive Next.js e-commerce tutorial covering app setup, product listings, shopping cart functionality, user authentication, Stripe payment processing, and the development of an Admin Dashboard for complete product and order management.",
  },
  {
    title: "Follow Us",
    socialLinks: [
      { icon: <MdFacebook size={24} />, url: "#" },
      { icon: <AiFillTwitterCircle size={24} />, url: "#" },
      { icon: <AiFillInstagram size={24} />, url: "#" },
      { icon: <AiFillYoutube size={24} />, url: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <div className="bg-slate-700 text-slate-200 text-sm mt-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
          {footerData.map((item, index) => (
            <FooterList key={index} title={item.title}>
              {item.links && item.links.map((link, linkIndex) => (
                <Link key={linkIndex} href="#">
                  {link}
                </Link>
              ))}
              {item.content && <p>{item.content}</p>}
              {item.socialLinks && (
                <div className="flex gap-2">
                  {item.socialLinks.map((socialLink, socialIndex) => (
                    <Link key={socialIndex} href={socialLink.url}>
                      {socialLink.icon}
                    </Link>
                  ))}
                </div>
              )}
            </FooterList>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Footer;
