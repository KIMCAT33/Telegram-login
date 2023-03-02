import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import TelegramLoginButton, { TelegramUser } from "telegram-login-button";
import { Bot, InlineKeyboard } from "grammy";

const Home: NextPage = () => {
  //Store bot screaming status
  let screaming = false;

  const [login, setLogin] = useState(false);

  const bot = new Bot("5527167347:AAFg51t0sd4lTYYLJndy7C1XhgKEdj4YoiE");
  // bot reply user button with link
  const sendLinkButton = () => {
    //This function handles the /scream command
    bot.command("scream", () => {
      screaming = true;
    });

    //This function handles /whisper command
    bot.command("whisper", () => {
      screaming = false;
    });

    //Pre-assign menu text
    const firstMenu =
      "<b>Menu 1</b>\n\nA beautiful menu with a shiny inline button.";
    const secondMenu =
      "<b>Menu 2</b>\n\nA better menu with even more shiny inline buttons.";

    //Pre-assign button text
    const nextButton = "Next";
    const backButton = "Back";
    const tutorialButton = "Tutorial";

    //Build keyboards
    const firstMenuMarkup = new InlineKeyboard().text(nextButton, backButton);

    const secondMenuMarkup = new InlineKeyboard()
      .text(backButton, backButton)
      .text(tutorialButton, "https://core.telegram.org/bots/tutorial");

    //This handler sends a menu with the inline buttons we pre-assigned above
    bot.command("menu", async (ctx) => {
      await ctx.reply(firstMenu, {
        parse_mode: "HTML",
        reply_markup: firstMenuMarkup,
      });
    });

    //This handler processes back button on the menu
    bot.callbackQuery(backButton, async (ctx) => {
      //Update message content with corresponding menu section
      await ctx.editMessageText(firstMenu, {
        reply_markup: firstMenuMarkup,
        parse_mode: "HTML",
      });
    });

    //This handler processes next button on the menu
    bot.callbackQuery(nextButton, async (ctx) => {
      //Update message content with corresponding menu section
      await ctx.editMessageText(secondMenu, {
        reply_markup: secondMenuMarkup,
        parse_mode: "HTML",
      });
    });

    //This function would be added to the dispatcher as a handler for messages coming from the Bot API
    bot.on("message", async (ctx) => {
      //Print to console
      console.log(
        `${ctx.from.first_name} wrote ${
          "text" in ctx.message ? ctx.message.text : ""
        }`
      );

      if (screaming && ctx.message.text) {
        //Scream the message
        await ctx.reply(ctx.message.text.toUpperCase(), {
          entities: ctx.message.entities,
        });
      } else {
        //This is equivalent to forwarding, without the sender's name
        await ctx.copyMessage(ctx.message.chat.id);
      }
    });

    //Start the Bot
    bot.start();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        {login ? (
          <h1>Logged in</h1>
        ) : (
          <TelegramLoginButton
            botName="TonicLoungeBot"
            usePic={true}
            dataOnauth={(user: TelegramUser) => {
              setLogin(true);
              console.log(user);
            }}
          />
        )}

        <button onClick={sendLinkButton}>Send Link</button>
        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
