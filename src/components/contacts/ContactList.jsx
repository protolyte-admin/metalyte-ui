import { Button, Empty, Space, Spin, Table, Tooltip, Typography } from "antd";
import { MessageOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import MarqAvatar from "../common/MarqAvatar";
import { formatPhoneNumber, getInitials } from "../../utils/format";
import { formatDateTimeIST, formatRelativeShortIST } from "../../utils/time";

function getContactName(contact) {
    return contact.name || contact.displayName || contact.fullName || "Unnamed contact";
}

function getContactTime(contact) {
    return (
        contact.lastContactedAt ||
        contact.lastMessageAt ||
        contact.updatedAt ||
        contact.createdAt ||
        null
    );
}

function ContactCell({ contact }) {
    const name = getContactName(contact);
    const notes = contact.notes || "";
    return (
        <Space size={14} className="contacts-name-cell">
            <MarqAvatar size={44}>{getInitials(name)}</MarqAvatar>
            <div className="contacts-name-copy">
                <Typography.Text strong className="contacts-name-text">
                    {name}
                </Typography.Text>
                {notes && (
                    <Typography.Text type="secondary" className="contacts-notes-text">
                        {notes}
                    </Typography.Text>
                )}
            </div>
        </Space>
    );
}

export default function ContactList({
    contacts,
    loading,
    onOpen,
    onCreateClick,
    hasMore = false,
    loadingMore = false,
    sentinelRef
}) {
    const navigate = useNavigate();

    const columns = [
        {
            title: "Contact",
            dataIndex: "name",
            key: "contact",
            width: 350,
            render: (_, contact) => <ContactCell contact={contact} />
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: 150,
            render: (phoneNumber) => formatPhoneNumber(phoneNumber) || "-"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 220,
            render: (email) => email || <Typography.Text type="secondary">No email</Typography.Text>
        },
        {
            title: "Updated",
            key: "updatedAt",
            width: 190,
            render: (_, contact) => formatDateTimeIST(getContactTime(contact)) || "-"
        },
        {
            title: "Last seen",
            key: "lastSeen",
            width: 120,
            render: (_, contact) => formatRelativeShortIST(getContactTime(contact)) || "-"
        },
        {
            title: "",
            key: "action",
            width: 72,
            align: "right",
            render: (_, contact) => (
                <Tooltip title="Start conversation">
                    <Button
                        type="text"
                        shape="circle"
                        icon={<MessageOutlined />}
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate("/", { state: { openPhoneNumber: contact.phoneNumber } });
                        }}
                    />
                </Tooltip>
            )
        }
    ];

    if (!loading && !contacts.length) {
        return (
            <div className="contacts-empty">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <span>
                            <strong>No contacts yet</strong>
                            <br />
                            Add your first contact to start a conversation.
                        </span>
                    }
                >
                    <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
                        Add contact
                    </Button>
                </Empty>
            </div>
        );
    }

    return (
        <div className="contacts-table-shell">
            <Table
                rowKey={(contact) => contact.id || contact.contactId || contact.phoneNumber}
                columns={columns}
                dataSource={contacts}
                loading={loading}
                pagination={false}
                sticky
                scroll={{ x: 1100 }}
                onRow={(contact) => ({
                    onClick: () => onOpen?.(contact)
                })}
                className="contacts-table"
            />
            <div ref={sentinelRef} className="contacts-load-row">
                {hasMore ? (
                    <Space size={10}>
                        <Spin size="small" />
                        <Typography.Text type="secondary">
                            {loadingMore ? "Loading next page..." : "Scroll to load more"}
                        </Typography.Text>
                    </Space>
                ) : (
                    <Typography.Text type="secondary">You've reached the end</Typography.Text>
                )}
            </div>
        </div>
    );
}