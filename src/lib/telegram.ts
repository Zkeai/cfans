import TelegramBot from 'node-telegram-bot-api';
import { SearchShopOrder, SetShopOrderStatus } from '@/service/shopOrder'
import { Getbalance, SetBalance } from '@/service/user'
const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
const bot = new TelegramBot(botToken, { polling: false });

// 用户状态存储
const userStates: Record<number, { step: string; userId?: string; action?: string }> = {};

// 初始化 Webhook
export async function setupWebhook(webhookUrl: string) {
    try {
        await bot.setWebHook(webhookUrl);
        console.log(`✅ Webhook 设置成功: ${webhookUrl}`);
    } catch (error) {
        throw error;
    }
}

// 处理命令或回调
export async function handleUpdate(update: any) {
    try {
        if (update.message) {
            const chatId = update.message.chat.id;
            const text = update.message.text;

            // 检查用户状态
            const userState = userStates[chatId];
            if (userState?.step === '等待订单ID') {
                // 用户输入订单 ID 后的处理
                await handleOrderIdInput(chatId, text);
            } else if (userState?.step === '等待用户ID') {
                // 用户输入用户 ID 后的处理
                userStates[chatId] = { step: '余额操作', userId: text };
                const operationMenu = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '增加', callback_data: 'balance_add' },
                                { text: '扣除', callback_data: 'balance_sub' },
                            ],
                        ],
                    },
                };
                await bot.sendMessage(chatId, `用户 ID 已收到：${text}，请选择操作：`, operationMenu);
            } else if (userState?.step === '等待金额') {
                // 用户输入金额后处理
                const userId = userState.userId || '未知用户';
                const action = userState.action === 'add' ? '+' : '-';

                const response = await SetBalance({ operation: action, userId, balance: Number(text) })
                if (response === "用户不存在") {
                    await bot.sendMessage(
                        chatId,
                        `用户 ${userId} 不存在`
                    );
                    return
                } else if (response === "该用户余额不足") {
                    await bot.sendMessage(
                        chatId,
                        `用户 ${userId} 余额不足`
                    );
                    return
                }
                const newBalance = await Getbalance(userId)
                await bot.sendMessage(
                    chatId,
                    `操作完成：用户 ${userId} ${action === "+" ? "增加" : "扣除"} 金额 ${text}。当前余额 ${newBalance}`
                );

                // 清除用户状态
                delete userStates[chatId];
            } else {
                // 处理普通命令
                handleCommand(chatId, text);
            }
        } else if (update.callback_query) {
            const chatId = update.callback_query.message?.chat.id || 0;
            const callbackData = update.callback_query.data;

            // 根据回调数据处理
            handleCallbackQuery(chatId, callbackData);
        }
    } catch (error) {
        console.error('❌ 处理更新时出错:', error);
    }
}

// 处理命令
async function handleCommand(chatId: number, text: string) {
    switch (true) {
        case text.startsWith('/start'): {
            const inlineMenu = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '订单管理', callback_data: 'shopOrder' },
                            { text: '余额管理', callback_data: 'balance' },
                        ],
                    ],
                },
            };
            await bot.sendMessage(chatId, '请选择一个操作：', inlineMenu);
            break;
        }
        default: {
            await bot.sendMessage(chatId, '未知命令，请输入 /start 查看菜单。');
            break;
        }
    }
}

// 处理回调数据
async function handleCallbackQuery(chatId: number, callbackData: string) {
    switch (callbackData) {
        case 'shopOrder':
            // 设置用户状态为等待输入订单 ID
            userStates[chatId] = { step: '等待订单ID' };
            await bot.sendMessage(chatId, '请输入订单 ID：');
            break;

        case 'shouhou':
            // 获取当前订单 ID 并处理售后操作
            const shouhouOrderId = userStates[chatId]?.userId || '未知订单';
            await bot.sendMessage(chatId, `订单 ${shouhouOrderId} 已标记为售后。`);
            break;

        case 'success':
            // 获取当前订单 ID 并处理完成操作
            const successOrderId = userStates[chatId]?.userId || '未知订单';
            await bot.sendMessage(chatId, `订单 ${successOrderId} 已标记为完成。`);
            break;

        case 'balance':
            // 设置用户状态为等待输入用户 ID
            userStates[chatId] = { step: '等待用户ID' };
            await bot.sendMessage(chatId, '请输入用户 ID：');
            break;

        case 'balance_add':
            // 设置用户状态为等待输入金额
            userStates[chatId] = { ...userStates[chatId], step: '等待金额', action: 'add' };
            await bot.sendMessage(chatId, '请输入需要增加的金额：');
            break;

        case 'balance_sub':
            // 设置用户状态为等待输入金额
            userStates[chatId] = { ...userStates[chatId], step: '等待金额', action: 'sub' };
            await bot.sendMessage(chatId, '请输入需要扣除的金额：');
            break;

        case 'order_stop': {
            const orderId = userStates[chatId]?.userId; // 读取存储的订单 ID
            if (!orderId) {
                await bot.sendMessage(chatId, '订单 ID 不存在，请重新输入。');
                return;
            }
            await SetShopOrderStatus(orderId, "stop"); // 传入正确的订单 ID
            await bot.sendMessage(chatId, `订单 ${orderId} 已更改状态为结束`);

            delete userStates[chatId];
            break;
        }
        case 'order_success': {
            const orderId = userStates[chatId]?.userId;
            if (!orderId) {
                await bot.sendMessage(chatId, '订单 ID 不存在，请重新输入。');
                return;
            }
            await SetShopOrderStatus(orderId, "success");
            await bot.sendMessage(chatId, `订单 ${orderId} 已更改状态为成功`);

            delete userStates[chatId];
            break;
        }
        case 'order_aftersales': {
            const orderId = userStates[chatId]?.userId;
            if (!orderId) {
                await bot.sendMessage(chatId, '订单 ID 不存在，请重新输入。');
                return;
            }
            await SetShopOrderStatus(orderId, "aftersales");
            await bot.sendMessage(chatId, `订单 ${orderId} 已更改状态为售后`);
            delete userStates[chatId];
            break;
        }

        default:
            await bot.sendMessage(chatId, '未知操作，请重试。');
    }
}

// 处理订单 ID 输入
async function handleOrderIdInput(chatId: number, orderId: string) {
    const orderIdPattern = /^[a-f0-9]{24}$/; // 正则表达式匹配 24 位小写字母和数字
    if (orderIdPattern.test(orderId)) {
        // 订单 ID 格式正确
        userStates[chatId] = { ...userStates[chatId], userId: orderId };
        //数据库查询是否存在
        const bool = await SearchShopOrder(orderId)
        if (bool) {
            const shoporderMenu = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '置订单结束', callback_data: 'order_stop' },
                            { text: '置订单完成', callback_data: 'order_success' },
                            { text: '置订单售后', callback_data: 'order_aftersales' },
                        ],
                    ],
                },
            };
            await bot.sendMessage(chatId, `请选择一个操作： `, shoporderMenu);
        } else {
            await bot.sendMessage(chatId, `订单 ID 不存在：${orderId} `,);
        }

        // 这里可以继续处理订单相关的操作
    } else {
        // 订单 ID 格式不正确
        await bot.sendMessage(chatId, '订单 ID 不存在或格式不正确，请重新输入。');
    }
}

export default bot;