"use client";
import React from "react";
import { Typography, Tag } from "@douyinfe/semi-ui";

const { Title, Paragraph, Text } = Typography;

const TermsAndConditions = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <title>服务条款</title>
      {/* 标题 */}
      <Title heading={4} className="mb-4 text-gray-800">
        服务条款
      </Title>

      {/* 服务条款内容 */}
      <Paragraph className="text-gray-600">
        使用{" "}
        <Text strong className="text-blue-500">
          cfans.muyuai.top
        </Text>
        提供的服务即构成对这些条款的同意。通过注册或使用我们的服务，您同意您已阅读并充分理解以下服务条款，对于未阅读以下服务条款的用户，
        <Text strong className="text-red-500">
          cfans.muyuai.top
        </Text>
        不承担任何形式的损失。
      </Paragraph>

      <Paragraph className="text-gray-600">
        严禁利用我们所销售服务用于一切非法用途，一旦发现用户在本站购买服务后用于非法用途，我们将全力配合有关部门予以打击！
      </Paragraph>

      <Paragraph className="text-gray-600">
        我们的全部服务都基于相关社交媒体平台上做的开发，我们永远也不知道相关平台明天会发生什么，服务所提供的开始时间、速度、掉落率均为预估数据，
        不保证你下单时的准确数据。
      </Paragraph>

      {/* 交付政策 */}
      <Title heading={5} className="mt-6 mb-2 text-gray-800">
        交付政策
      </Title>
      <Paragraph className="text-gray-600">
        我们不保证任何服务的交付时间，因为它取决于该服务当前的订单数量与您所购买的相关社交媒体平台的更新情况，我们只是提供一个最佳时间估计，这只是一个估计，
        我们无法为你马上开始，任何十万火急的单请不要购买。
      </Paragraph>

      <Paragraph className="text-gray-600">
        我们不接受服务描述时间内的取消申请，也无法马上给你取消订单，请在下单前考虑清楚自己需求。
      </Paragraph>

      <Paragraph className="text-gray-600">
        我们不接受你错误的链接订单取消退款，系统是自动的，它们会完成并交付，在购买前认真核对你的链接和需求。
      </Paragraph>

      <Paragraph className="text-gray-600">
        请不要同时为1个链接购买多个相同服务，在这种情况下，我们无法为您提供正确的关注者/点赞数量。我们不会为这些订单退款。例如你为1个链接买了
        100粉丝A和100粉丝B， 我们不会保证您能收到200粉丝，我们也不会为此负责。
      </Paragraph>

      <Paragraph className="text-gray-600">
        放错链接或用户名时，您的订单很可能无法获得退款，这是由每个服务的识别系统和处理方式决定的结果。我们系统没有那么智能识别你心里真正想加的链接是什么，
        所以在下订单之前，请务必确认每个订单内容。
      </Paragraph>

      {/* 服务政策 */}
      <Title heading={5} className="mt-6 mb-2 text-gray-800">
        服务政策
      </Title>
      <Paragraph className="text-gray-600">
        本网站服务仅用于推广您的 INSTAGRAM / TWITTER / FACEBOOK
        等其他社交帐户，并帮助提升您的“外观”。我们也不保证您的新关注者会与您互动，我们只保证您获得您购买的关注者数量。
      </Paragraph>

      <Paragraph className="text-gray-600">
        我们不保证100%的帐户将拥有个人资料、完整的信息和头像，尽管我们努力让所有帐户更像个真人。
      </Paragraph>

      <Paragraph className="text-gray-600">
        所有服务在下单前必须将您的相关链接全部公开，不要限制评论、限制国家、设置私人账号等。
      </Paragraph>

      <Paragraph className="text-gray-600">
        我们的全部服务默认采用数量计数判断的方式，请不要同时在其他人那里购买相同的服务，这可能导致数量的冲突，我们不会对此进行负责和退款。
      </Paragraph>

      <Paragraph className="text-gray-600">
        我们对 INSTAGRAM、TWITTER、FACEBOOK、YOUTUBE
        等其他社交媒体的任何帐户暂停或内容删除概不负责，如你有顾虑请一开始就不要购买。
      </Paragraph>

      <Paragraph className="text-gray-600">
        关于同种类型有着不同的服务，它们是不一样的，它们运行在不同的服务器上、运行方式可能也有所区别、使用的账号类型可能有所区别，它们是不同的服务，给出的价格也会不一样。
      </Paragraph>

      <Paragraph className="text-gray-600">
        如果您购买订单中的相关链接填错但有效，我们将无法为订单取消和退款，请下单前检查。
      </Paragraph>

      {/* 售后政策 */}
      <Title heading={5} className="mt-6 mb-2 text-gray-800">
        售后政策
      </Title>
      <Paragraph className="text-gray-600">
        若服务无售后，则表示掉落不提供补充，有些易掉落的服务会在加粉过程、加粉完成后1秒、1分钟、1天后部分掉落或全部掉落，此时也不会提供补充。
      </Paragraph>

      <Paragraph className="text-gray-600">
        若服务有售后，表示在售后期内可提供补充，补充时间取决于该服务当前订单数、对应平台风控程度等，你需要在补充期内要求补充。服务默认补充范围都是该订单对应的范围（开始数—完成数），
        少于开始数或大于完成数不会提供补充，不接受“部分粉丝是我引流来的，就是服务的粉丝掉了”等各种原因扯皮，无特殊说明，服务都以订单范围进行依据进行补充。
      </Paragraph>

      <Paragraph className="text-gray-600">
        售后仅对下单链接负责，不接受修改链接后的新链接。不要尝试拿其他账号互换用户名来骗补充。
      </Paragraph>

      <Paragraph className="text-gray-600">
        服务允许有一定的掉落率（通常10%），当掉落率过少或掉落数量过少时（没有具体数据），如掉了几个或10几个的粉丝，系统不会保证补充你的订单。
      </Paragraph>

      <Paragraph className="text-gray-600">
        当你的原粉丝数等购买服务前的基础数过大或基础数远大于购买数时，如：原有1000粉丝买了50个粉丝、原有10w粉丝买了1000个粉丝。此时就算服务有售后也不保证补充，我们无法确定掉落属于谁。
      </Paragraph>

      {/* 退款政策 */}
      <Title heading={5} className="mt-6 mb-2 text-gray-800">
        退款政策
      </Title>
      <Paragraph className="text-gray-600">
        不提供退款，充值前请认真考虑自己的需求，按需充值。
      </Paragraph>

      {/* 隐私政策 */}
      <Title heading={5} className="mt-6 mb-2 text-gray-800">
        隐私政策
      </Title>
      <Paragraph className="text-gray-600">
        我们认真对待您的隐私，并将采取一切措施保护您的相关信息。
      </Paragraph>

      <Paragraph className="text-gray-600">
        我们仅在“需要知道的基础上”使用这些信息，收到的相关信息仅用于填写您的订单。我们不会向任何人出售或重新分发您的信息。
      </Paragraph>
    </div>
  );
};

export default TermsAndConditions;
