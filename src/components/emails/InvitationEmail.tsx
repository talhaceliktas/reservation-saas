import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface InvitationEmailProps {
  orgName: string;
  inviterName: string;
  role: string;
  inviteLink: string;
}

export const InvitationEmail = ({
  orgName,
  inviterName,
  role,
  inviteLink,
}: InvitationEmailProps) => {
  const previewText = `${inviterName} invited you to join the ${orgName} team on BookIt.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Join the <strong>{orgName}</strong> Team
            </Heading>
            <Text className="text-black text-[14px] leading-6">Hello,</Text>
            <Text className="text-black text-[14px] leading-6">
              <strong>{inviterName}</strong> has invited you to join the{" "}
              <strong>{orgName}</strong> organization on <strong>BookIt</strong>{" "}
              as a <span className="uppercase font-bold">{role}</span>.
            </Text>
            <Section className="text-center mt-8 mb-8">
              <Button
                className="bg-[#2563eb] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Accept Invitation
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-6">
              or copy and paste this URL into your browser:
              <br />
              <a href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvitationEmail;
