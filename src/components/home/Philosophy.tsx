const principles = [
    { title: 'Start with the problem.', text: 'A useful app begins with something someone needs, not a list of features.' },
    { title: 'Make it real.', text: 'Put a working version in people’s hands, listen, and make it better.' },
    { title: 'Leave room to breathe.', text: 'Good software helps when it’s needed and doesn’t demand attention when it isn’t.' },
];
export default function Philosophy() {
    return (
        <section id="philosophy" className="principles section-wrap" aria-labelledby="principles-title">
            <h2 id="principles-title">A few things I believe<br />{" "}about building.</h2>
            <div className="principles-list">{principles.map(item => <div className="principle" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
        </section>
    );
}
